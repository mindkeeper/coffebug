const db = require("../config/postgre");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getTimeStamp = require("../helper/getTimeStamp");
const createOtp = require("../helper/createOtp");

const { SECRET_KEY } = process.env;
const authsModel = {
  register: (req) =>
    new Promise((resolve, reject) => {
      const { email, password, phone } = req.body;
      const sqlCheckAvailibility =
        "select u.email, up.phone from users u join users_profile up on up.user_id = u.id where u.email=$1 or up.phone=$2";
      db.query(sqlCheckAvailibility, [email, phone], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (result.rows.length > 0) {
          if (result.rows.length > 1) {
            return reject({
              status: 403,
              msg: "Email and Phone Number Already Exist!",
            });
          }
          if (result.rows[0].email == email)
            return reject({
              status: 403,
              msg: "Email Already Exist!",
            });
          if (result.rows[0].phone == phone)
            return reject({
              status: 403,
              msg: "Phone Number Already Exist!",
            });
        }
        bcrypt.hash(password, 10, (error, hashedPwd) => {
          if (error) {
            console.log(error);
            return reject({ status: 500, msg: "Internal Server Error" });
          }
          const sqlCreateUser =
            "INSERT INTO USERS (email, password, register_otp, role_id) VALUES($1, $2, $3, $4) returning id, register_otp";
          const values = [email, hashedPwd, createOtp(), 1];
          db.query(sqlCreateUser, values, (error, res) => {
            if (error) {
              console.log(error);
              return reject({ status: 500, msg: "Internal Server Error" });
            }
            const id = res.rows[0].id;
            const otp = res.rows[0].register_otp;
            const sqlCreateProfile =
              "INSERT INTO users_profile (user_id, phone) values($1, $2)";
            db.query(sqlCreateProfile, [id, phone], (error) => {
              if (error) {
                console.log(error);
                return reject({ status: 500, msg: "Internal Server Error" });
              }
              return resolve({ otp });
            });
          });
        });
      });
    }),
  verifyRegister: (req) =>
    new Promise((resolve, reject) => {
      const otp = req.params.otp;
      const sqlCheckOtp =
        "SELECT id, register_otp from users where register_otp = $1";
      db.query(sqlCheckOtp, [otp], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (result.rows.length === 0)
          return reject({ status: 401, msg: "Wrong OTP" });
        const id = result.rows[0].id;
        const sqlVerify =
          "update users set register_otp = $1, updated_at = to_timestamp($2) where id = $3 and register_otp = $4";
        db.query(sqlVerify, [null, getTimeStamp(), id, otp], (error, _) => {
          if (error) {
            console.log(error);
            return reject({ status: 500, msg: "Internal Server Error" });
          }
          return resolve({ status: 200, msg: "Email Verified, Please Login" });
        });
      });
    }),

  login: (body) => {
    return new Promise((resolve, reject) => {
      const { email, password } = body;
      const getPwdQuery =
        "select u.id, u.email, u.password, up.image, register_otp as otp, r.role from users u left join roles r on u.role_id = r.id left join users_profile up on u.id = up.user_id where email = $1";
      const invalidCridentials = "Email/Password is Wrong!";
      const statusCode = 401;

      db.query(getPwdQuery, [email], (error, response) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            error: { msg: "Internal Server Error" },
          });
        }
        //return resolve(response.rows[0].password);
        if (response.rows.length === 0)
          return reject({
            status: statusCode,
            error: { msg: invalidCridentials },
          });
        if (response.rows[0].otp)
          return reject({
            status: 401,
            error: { msg: "Please Verify Your Email" },
          });
        const hashedPwd = response.rows[0].password;
        bcrypt.compare(password, hashedPwd, (error, isSame) => {
          if (error) {
            console.log(error);
            return reject({
              status: 500,
              error: { msg: "Internal Server Error" },
            });
          }
          if (!isSame)
            return reject({
              status: statusCode,
              error: { msg: invalidCridentials },
            });
          const payload = {
            id: response.rows[0].id,
            email: response.rows[0].email,
            role: response.rows[0].role,
            image: response.rows[0].image,
          };
          jwt.sign(
            payload,
            SECRET_KEY,
            { expiresIn: "10h" },
            (error, token) => {
              if (error) {
                console.log(error);
                return reject({
                  status: 500,
                  error: { msg: "Internal Server Error" },
                });
              }
              return resolve({
                status: 200,
                msg: "Login Successfull",
                data: { token, payload },
              });
            }
          );
        });
      });
    });
  },
  logout: (token) => {
    return new Promise((resolve, reject) => {
      const query = "insert into blacklist_token(token) values($1)";
      db.query(query, [token], (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            error: { msg: "Internal Server Error" },
          });
        }
        return resolve({ status: 200, msg: "Logout Successful" });
      });
    });
  },
  forgotPassword: (req) =>
    new Promise((resolve, reject) => {
      const { email } = req.body;
      const sqlCheckUser = "Select id, email from users where email = $1";
      db.query(sqlCheckUser, [email], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (result.rows.length === 0)
          return reject({ status: 404, msg: "Your Email Isn't Registered" });
        const otp = createOtp();
        const id = result.rows[0].id;
        const sqlCreateOtp =
          "update users set password_otp = $1, updated_at = to_timestamp($2) where id = $3 returning password_otp";
        db.query(sqlCreateOtp, [otp, getTimeStamp(), id], (error) => {
          if (error) {
            console.log(error);
            return reject({ status: 500, msg: "Internal Server Error" });
          }
          return resolve({ otp, email });
        });
      });
    }),
  resetPassword: (req) =>
    new Promise((resolve, reject) => {
      const { otp, newPassword, confirmPassword } = req.body;
      if (newPassword !== confirmPassword)
        return reject({ status: 400, msg: "confirm password isn't matched" });
      const sqlCheckUser = "select id from users where password_otp = $1";
      db.query(sqlCheckUser, [otp], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (result.rows.length === 0)
          return reject({ status: 401, msg: "Wrong OtP" });
        const id = result.rows[0].id;
        bcrypt.hash(newPassword, 10, (error, hashedPwd) => {
          if (error) {
            console.log(error);
            return reject({ status: 500, msg: "Internal Server Error" });
          }
          const sqlUpdatePwd =
            "update users set password = $1, password_otp = $2, updated_at = to_timestamp($3) where id = $4";
          db.query(
            sqlUpdatePwd,
            [hashedPwd, null, getTimeStamp(), id],
            (error, _) => {
              if (error) {
                console.log(error);
                return reject({ status: 500, msg: "Internal Server Error" });
              }
              return resolve({
                status: 200,
                msg: "Update Password Successfully",
              });
            }
          );
        });
      });
    }),
};

module.exports = authsModel;
