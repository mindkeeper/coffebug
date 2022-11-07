const db = require("../config/postgre");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
};

module.exports = authsModel;
