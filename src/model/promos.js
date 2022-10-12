const db = require("../config/postgre");
const { param } = require("../routes/users");

const promosModel = {
  getPromos: (params) => {
    return new Promise((resolve, reject) => {
      let query = "select * from promos where lower(promoname) like lower($1)";
      const promoName = !params.name ? "%%" : `%${params.name}%`;
      //return resolve(promoName);
      db.query(query, [promoName], (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  },
  createPromo: (body) => {
    return new Promise((resolve, reject) => {
      const query =
        "insert into promos(promoname, discount, minimumprice, maxdiscount, created, durations) values($1, $2, $3, $4, $5, $6)";
      const {
        promoname,
        discount,
        minimumprice,
        maxdiscount,
        created,
        durations,
      } = body;
      db.query(
        query,
        [promoname, discount, minimumprice, maxdiscount, created, durations],
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );
    });
  },
  updatePromo: (body, params) => {
    return new Promise((resolve, reject) => {
      const values = [];
      let query = "update promos set ";
      Object.keys(body).forEach((key, index, array) => {
        if (index === array.length - 1) {
          query += `${key} = $${index + 1} where promoid = $${index + 2}`;
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
  dropPromo: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from promos where promoid = $1";
      db.query(query, [params.id], (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  },
};

module.exports = promosModel;
