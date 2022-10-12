const db = require("../config/postgre");

const producttypesModel = {
  getProductTypes: () => {
    return new Promise((resolve, reject) => {
      const query = "select * from producttypes";
      db.query(query, (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve(result);
      });
    });
  },
  createProductType: (body) => {
    return new Promise((resolve, reject) => {
      const query = "insert into producttypes(typename) values($1)";
      const typename = body.typename;
      db.query(query, [typename], (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve(result);
      });
    });
  },
  updateProductType: (body, params) => {
    return new Promise((resolve, reject) => {
      let query = "update producttypes set ";
      const values = [];

      Object.keys(body).forEach((key, index, arr) => {
        if (index === arr.length - 1) {
          query += `${key} = $${index + 1} where typeid = $${index + 2}`;
          values.push(body[key], params.id);
          return;
        }
        query += `${key} = $${index + 1}, `;
        values.push(body[key]);
      });

      db.query(query, values, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  },
  dropProductType: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from producttypes where typeid = $1";
      db.query(query, [params.id], (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  },
};

module.exports = producttypesModel;
