const db = require("../config/postgre");
const bcrypt = require("bcrypt");
const userModels = {
  getUsers: (id) => {
    return new Promise((resolve, reject) => {
      const query =
        "select up.*, u.email from users_profile up join users u on u.id = up.user_id where up.user_id =$1";
      db.query(query, [id], (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  },
  createUser: (body) => {
    return new Promise((resolve, reject) => {
      const queries = {
        checkEmailandPhone:
          "select up.phone, u.email from users_profile up left join users u on u.id = up.user_id where phone = $1 or email = $2",
        userInsert:
          "insert into users(email, password, created_at, updated_at, role_id) values($1, $2, to_timestamp($3), to_timestamp($4), $5) returning id",
        profileInsert:
          "insert into users_profile(user_id, phone, created_at, updated_at) values($1, $2, to_timestamp($3), to_timestamp($4))",
      };
      const { checkEmailandPhone, userInsert, profileInsert } = queries;
      const timeStamp = Date.now() / 1000;
      const { email, password, phone } = body;

      db.query(checkEmailandPhone, [phone, email], (error, checkResult) => {
        if (error) {
          console.log(error);
          return reject({ error });
        }
        //return resolve(checkResult.rows);
        if (checkResult.rows.length > 0) {
          const errorMessage = [];
          if (
            checkResult.rows.length > 1 ||
            (checkResult.rows[0].phone == phone &&
              checkResult.rows[0].email == email)
          )
            errorMessage.push("Email and phone number already exist", 403);

          if (checkResult.rows[0].phone == phone)
            errorMessage.push("Phone number already exist", 403);
          if (checkResult.rows[0].email == email)
            errorMessage.push("Email already exist", 403);

          return reject({
            error: new Error(errorMessage[0]),
            statusCode: errorMessage[1],
          });
        }
        bcrypt.hash(password, 10, (error, hashedPwd) => {
          if (error) {
            console.log(error);
            return reject({ error });
          }
          const role = 1;
          db.query(
            userInsert,
            [email, hashedPwd, timeStamp, timeStamp, 1],
            (error, result) => {
              if (error) {
                console.log(error);
                return reject({ error });
              }
              db.query(
                profileInsert,
                [result.rows[0].id, phone, timeStamp, timeStamp],
                (error, profileResult) => {
                  if (error) {
                    console.log(error);
                    return reject({ error });
                  }
                  return resolve(result);
                }
              );
            }
          );
        });
      });
    });
  },
  updateUser: (body, id) => {
    return new Promise((resolve, reject) => {
      const timeStamp = Date.now() / 1000;
      const values = [];
      let query = "update users_profile set ";
      Object.keys(body).forEach((key, index, array) => {
        if (index === array.length - 1) {
          query += `${key} = $${index + 1}, updated_at = to_timestamp($${
            index + 2
          }) where user_id = $${index + 3} returning display_name`;
          values.push(body[key], timeStamp, id);
          return;
        }
        query += `${key} = $${index + 1}, `;
        values.push(body[key]);
      });

      db.query(query, values, (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve(result);
      });
      // const checkUsername =
      //   "select username from users_profile where username = $1";
      // db.query(checkUsername, username, (err, checkResult) => {
      //   if (err) return reject({ err });
      //   return resolve(checkResult);
      //   if (checkResult.rows.length > 0)
      //     return reject({
      //       err: new Error("Username Already Taken"),
      //       statusCode: 403,
      //     });
      //   return resolve("Success");
      // });
    });
  },
  dropUser: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from users where id = $1";
      db.query(query, [params.id], (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  },
  editPassword: (body, params) => {
    return new Promise((resolve, reject) => {
      const getPasswordQuery = "select password from users where id = $1";
      const { old_password, new_password } = body;
      db.query(getPasswordQuery, [params], (error, response) => {
        if (error) {
          console.log(error);
          return reject({ error });
        }
        //return resolve(response.rows);
        const oldHashedPwd = response.rows[0].password;
        bcrypt.compare(old_password, oldHashedPwd, (error, isSame) => {
          if (error) {
            console.log(error);
            return reject({ error });
          }
          if (!isSame)
            return reject({
              error: new Error("Wrong old password"),
              statusCode: 403,
            });
          bcrypt.hash(new_password, 10, (error, newHashedPwd) => {
            if (error) {
              console.log(error);
              return reject({ error });
            }
            const editPwdQuery = "update users set password = $1 where id = $2";
            db.query(editPwdQuery, [newHashedPwd, params], (error, result) => {
              if (error) {
                console.log(error);
                return reject({ error });
              }
              return resolve(result);
            });
          });
        });
      });
    });
  },
};
module.exports = userModels;
