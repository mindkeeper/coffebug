const db = require("../config/postgre");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const authsModel = {
  login: (body) => {
    return new Promise((resolve, reject) => {
      const { email, password } = body;
      const getPwdQuery =
        "select u.id, u.email, u.password, r.role from users u left join roles r on u.role_id = r.id where email = $1";
      const invalidCridentials = new Error("Email/Password is Wrong!");
      const statusCode = 401;

      db.query(getPwdQuery, [email], (error, response) => {
        if (error) {
          console.log(error);
          return reject({ error });
        }
        //return resolve(response.rows[0].password);
        if (response.rows.length === 0)
          return reject({ error: invalidCridentials, statusCode });
        const hashedPwd = response.rows[0].password;
        bcrypt.compare(password, hashedPwd, (error, isSame) => {
          if (error) {
            console.log(error);
            return reject({ error });
          }
          if (!isSame) return reject({ error: invalidCridentials, statusCode });
          const payload = {
            id: response.rows[0].id,
            email: response.rows[0].email,
            role: response.rows[0].role,
          };
          jwt.sign(
            payload,
            SECRET_KEY,
            { expiresIn: "10m" },
            (error, token) => {
              if (error) {
                console.log(error);
                return reject({ error });
              }
              return resolve({ token, payload });
            }
          );
        });
      });
    });
  },
};

module.exports = authsModel;
