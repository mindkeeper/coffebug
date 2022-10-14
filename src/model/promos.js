const db = require("../config/postgre");

const promosModel = {
  getPromos: (params) => {
    return new Promise((resolve, reject) => {
      let query = "select * from promos where lower(code) like lower($1)";
      const promoCode = !params.code ? "%%" : `%${params.code}%`;
      //return resolve(promoName);
      db.query(query, [promoCode], (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  },
  createPromo: (body) => {
    return new Promise((resolve, reject) => {
      const query =
        "insert into promos(code, discount, description, duration, created_at, updated_at) values($1, $2, $3, $4, to_timestamp($5), to_timestamp($6))";
      const { code, discount, description, duration } = body;
      const timestamp = Date.now() / 1000;
      db.query(
        query,
        [
          code.toUpperCase(),
          discount,
          description,
          duration,
          timestamp,
          timestamp,
        ],
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
      const timestamp = Date.now() / 1000;
      let query = "update promos set ";
      Object.keys(body).forEach((key, index, array) => {
        if (index === array.length - 1) {
          query += `${key} = $${index + 1}, updated_at = to_timestamp($${
            index + 2
          })  where id = $${index + 3}`;
          values.push(body[key], timestamp, params.id);
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
      const query = "delete from promos where id = $1";
      db.query(query, [params.id], (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  },
};

module.exports = promosModel;
