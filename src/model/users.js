const db = require("../config/postgre");
const bcrypt = require("bcrypt");
const userModels = {
  getUsers: (id) => {
    return new Promise((resolve, reject) => {
      const query =
        "select up.username, up.first_name, up.last_name, up.display_name,up.gender, up.birthday, up.address, up.image, up.phone, u.email from users_profile up join users u on u.id = up.user_id where up.user_id =$1";
      db.query(query, [id], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        return resolve({ status: 200, data: result.rows });
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
          "insert into users_profile(user_id, phone) values($1, $2, to_timestamp($3), to_timestamp($4))",
      };
      const { checkEmailandPhone, userInsert, profileInsert } = queries;
      const timeStamp = Date.now() / 1000;
      const { email, password, phone } = body;

      db.query(checkEmailandPhone, [phone, email], (error, checkResult) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (checkResult.rows.length > 0) {
          const errorMessage = [];
          if (
            checkResult.rows.length > 1 ||
            (checkResult.rows[0].phone == phone &&
              checkResult.rows[0].email == email)
          )
            errorMessage.push(403, "Email and phone number already exist");

          if (checkResult.rows[0].phone == phone)
            errorMessage.push(403, "Phone number already exist");
          if (checkResult.rows[0].email == email)
            errorMessage.push(403, "Email already exist");

          return reject({
            status: errorMessage[0],
            msg: errorMessage[1],
          });
        }
        bcrypt.hash(password, 10, (error, hashedPwd) => {
          if (error) {
            console.log(error);
            return reject({ status: 500, msg: "internal server error" });
          }
          const role = 1;
          db.query(
            userInsert,
            [email, hashedPwd, timeStamp, timeStamp, role],
            (error, result) => {
              if (error) {
                console.log(error);
                return reject({ status: 500, msg: "Internal Server Error" });
              }
              db.query(
                profileInsert,
                [result.rows[0].id, phone, timeStamp, timeStamp],
                (error, profileResult) => {
                  if (error) {
                    return reject({
                      status: 500,
                      msg: "Internal Server Error",
                    });
                  }
                  return resolve({
                    status: 201,
                    msg: `Congrats ${body.email}, your account created successfully`,
                  });
                }
              );
            }
          );
        });
      });
    });
  },
  updateUser: (body, id, file) => {
    return new Promise((resolve, reject) => {
      const timeStamp = Date.now() / 1000;
      const values = [];
      let query = "update users_profile set ";
      let imageUrl = "";
      if (file) {
        imageUrl = `${file.url} `;
        if (Object.keys(body).length > 0) {
          query += `image = '${imageUrl}', `;
        }
        if (Object.keys(body).length === 0) {
          query += `image = '${imageUrl}', updated_at = to_timestamp($1) where user_id = $2 returning display_name`;
          values.push(timeStamp, id);
        }
      }
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
      console.log(query);
      db.query(query, values, (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        let data = {};
        if (file) data = { Image: imageUrl, ...result.rows[0] };
        data = { Image: imageUrl, ...result.rows[0] };
        return resolve({
          status: 200,
          msg: `${result.rows[0].display_name}, your profile successfully updated`,
          data,
        });
      });
    });
  },
  dropUser: (id) => {
    return new Promise((resolve, reject) => {
      const query = "delete from users where id = $1 returning email";
      const delprofileQuery = "delete from users_profile where user_id = $1";
      db.query(delprofileQuery, [id], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        db.query(query, [id], (error, deleteResult) => {
          if (error) {
            console.log(error);
            return reject({ status: 500, msg: "Internal Server Error" });
          }
          return resolve({
            status: 200,
            msg: `${deleteResult.rows[0].email}, your account has been deleted`,
            data: { ...deleteResult.rows[0] },
          });
        });
      });
    });
  },
  editPassword: (body, id) => {
    return new Promise((resolve, reject) => {
      const getPasswordQuery = "select password from users where id = $1";
      const { old_password, new_password } = body;
      db.query(getPasswordQuery, [id], (error, response) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        const oldHashedPwd = response.rows[0].password;
        bcrypt.compare(old_password, oldHashedPwd, (error, isSame) => {
          if (error) {
            console.log(error);
            return reject({ status: 500, msg: "Internal Server Error" });
          }
          if (!isSame)
            return reject({
              status: 403,
              msg: "Wrong old password",
            });
          bcrypt.hash(new_password, 10, (error, newHashedPwd) => {
            if (error) {
              console.log(error);
              return reject({ status: 500, msg: "Internal Server Error" });
            }
            const editPwdQuery =
              "update users set password = $1 where id = $2 returning email";
            db.query(editPwdQuery, [newHashedPwd, id], (error, result) => {
              if (error) {
                console.log(error);
                return reject({ status: 500, msg: "Internal Server Error" });
              }
              return resolve({
                status: 200,
                msg: `${result.rows[0].email}, your password has been updated`,
              });
            });
          });
        });
      });
    });
  },
};
module.exports = userModels;
