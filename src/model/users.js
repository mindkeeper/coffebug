const db = require("../config/postgre");

const userModels = {
  getUsers: (params) => {
    return new Promise((resolve, reject) => {
      const query = "select * from users where userid =$1";
      db.query(query, [params.id], (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  },
  createUser: (body) => {
    return new Promise((resolve, reject) => {
      const query =
        "insert into users(username, password, email, firstname, lastname, displayname, image, gender, phone, address, birthday, created) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
      const {
        username,
        password,
        email,
        firstname,
        lastname,
        displayname,
        image,
        gender,
        phone,
        address,
        birthday,
        created,
      } = body;
      db.query(
        query,
        [
          username,
          password,
          email,
          firstname,
          lastname,
          displayname,
          image,
          gender,
          phone,
          address,
          birthday,
          created,
        ],
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );
    });
  },
  updateUser: (body, params) => {
    return new Promise((resolve, reject) => {
      const values = [];
      let query = "update users set ";
      Object.keys(body).forEach((key, index, array) => {
        if (index === array.length - 1) {
          query += `${key} = $${index + 1} where userid = $${index + 2}`;
          values.push(body[key], params.id);
          return;
        }
        query += `${key} = $${index + 1}, `;
        values.push(body[key]);
      });

      db.query(query, values, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  },
  dropUser: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from users where userid = $1";
      db.query(query, [params.id], (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  },
};
module.exports = userModels;
