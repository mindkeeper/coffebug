const db = require("../config/postgre");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtr = require("jwt-redis").default;
const client = require("../config/redis");

const { SECRET_KEY } = process.env;
const authsModel = {
  login: (body) => {
    return new Promise((resolve, reject) => {
      const { email, password } = body;
      const getPwdQuery =
        "select u.id, u.email, u.password, up.image, r.role from users u left join roles r on u.role_id = r.id left join users_profile up on u.id = up.user_id where email = $1";
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

  resetPassword: (body) => {
    return new Promise((resolve, reject) => {
      const { email, code, new_password } = body;
      if (email && !code && !new_password) {
        const query = "select email from users where email = $1";
        db.query(query, [email], (error, result) => {
          if (error) {
            console.log("1", error);
            return reject({
              status: 500,
              error: { msg: "Internal Server Error" },
            });
          }
          if (result.rows.length === 0)
            return reject({
              status: 400,
              error: { msg: "Your email isn't registered" },
            });
          const otp = Math.floor(Math.random() * 1e6).toString();
          client
            .get(email)
            .then((result) => {
              if (result)
                client
                  .del(email)
                  .then()
                  .catch((err) => {
                    console.log(err.message);
                    return reject({
                      status: 500,
                      error: { msg: "Internal Server Error" },
                    });
                  });

              client
                .set(email, otp, { EX: 120, NX: true })
                .then(() => {
                  return resolve({
                    status: 200,
                    data: {
                      otp,
                    },
                  });
                })
                .catch((err) => {
                  console.log(err.message);
                  return reject({
                    status: 500,
                    error: { msg: "Internal Server Error" },
                  });
                });
            })
            .catch((err) => {
              console.log(err.message);
              return reject({
                status: 500,
                error: { msg: "Internal Server Error" },
              });
            });
        });
      }
    });
  },
};

module.exports = authsModel;
