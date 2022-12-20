const db = require("../config/postgre");

const promosModel = {
  getPromosById: (id) => {
    return new Promise((resolve, reject) => {
      const query = "select * from promos where id = $1";
      db.query(query, [id], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (result.rows.length === 0)
          return reject({ status: 404, msg: "Promo Not Found" });

        return resolve({
          status: 200,
          msg: "Detail Promo",
          data: { ...result.rows[0] },
        });
      });
    });
  },
  getPromos: (params) => {
    return new Promise((resolve, reject) => {
      let link = "/api/promos?";
      const { code, page, limit } = params;
      const countQuery =
        "select count(id) as count from promos where lower(code) like lower($1) and id != $2";
      const query =
        "select * from promos where lower(code) like lower($1) and id !=$4 order by created_at desc limit $2 offset $3 ";
      const sqlLimit = !limit ? 4 : parseInt(limit);
      const sqlOffset =
        !page || page === "1" ? 0 : parseInt(page - 1) * sqlLimit;
      let promoCode = "%%";
      if (code) {
        link += `code=${code}`;
        promoCode = `%${code}%`;
      }
      db.query(countQuery, [promoCode, 1], (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "Internal server error",
          });
        }
        const totalData = parseInt(result.rows[0].count);
        const currentPage = page ? parseInt(page) : 1;
        const totalPage =
          sqlLimit > totalData ? 1 : Math.ceil(totalData / sqlLimit);
        const prev =
          currentPage === 1
            ? null
            : link + `page=${currentPage - 1}&limit=${sqlLimit}`;
        const next =
          currentPage === totalPage
            ? null
            : link + `page=${currentPage + 1}&limit=${sqlLimit}`;
        const meta = {
          page: currentPage,
          totalPage: parseInt(totalPage),
          limit: sqlLimit,
          totalData: parseInt(totalData),
          prev,
          next,
        };
        db.query(
          query,
          [promoCode, sqlLimit, sqlOffset, 1],
          (error, result) => {
            if (error) {
              console.log(error);
              return reject({
                status: 500,
                msg: "Internal Server Error",
              });
            }
            if (result.rows.length === 0)
              return reject({ status: 404, msg: "Data not Found" });
            return resolve({
              status: 200,
              msg: "List Promos",
              data: result.rows,
              meta,
            });
          }
        );
      });
    });
  },
  createPromo: (body, file) => {
    return new Promise((resolve, reject) => {
      const query =
        "insert into promos(code, discount, description, duration, created_at, updated_at, image, promo_name, min_price) values($1, $2, $3, $4, to_timestamp($5), to_timestamp($6), $7, $8, $9) returning *";
      const { code, discount, description, duration, promo_name, min_price } =
        body;
      const imageUrl = `${file.url}`;
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
          imageUrl,
          promo_name,
          min_price,
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            return reject({
              status: 500,
              msg: "Internal Server Error",
            });
          }

          return resolve({
            status: 201,
            msg: `promo ${result.rows[0].code} created sucessfully`,
            data: { ...result.rows[0] },
          });
        }
      );
    });
  },
  updatePromo: (body, params, file) => {
    return new Promise((resolve, reject) => {
      const values = [];
      const timestamp = Date.now() / 1000;
      let imageUrl = null;
      let query = "update promos set ";
      if (file) {
        imageUrl = `${file.url}`;
        if (Object.keys(body).length === 0) {
          query += `image = '${imageUrl}', updated_at = to_timestamp($1) where id = $2`;
          values.push(timestamp, params.id);
        }
        if (Object.keys(body).length > 0) {
          query += `image = '${imageUrl}', `;
        }
      }
      let returning = "returning ";
      Object.keys(body).forEach((key, index, array) => {
        if (index === array.length - 1) {
          returning += `${key}`;
          query += `${key} = $${index + 1}, updated_at = to_timestamp($${
            index + 2
          })  where id = $${index + 3} ${returning}`;

          values.push(body[key], timestamp, params.id);
          return;
        }
        query += `${key} = $${index + 1}, `;
        returning += `${key}, `;
        values.push(body[key]);
      });

      db.query(query, values, (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "Internal Server Error",
          });
        }
        if (result.rowCount === 0)
          return reject({
            status: 404,
            msg: "Update promo failed, promo not found",
          });
        const data = file
          ? { image: imageUrl, ...result.rows[0] }
          : { ...result.rows[0] };
        return resolve({
          status: 201,
          msg: `promo updated sucessfully`,
          data,
        });
      });
    });
  },
  dropPromo: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from promos where id = $1 returning *";
      db.query(query, [params.id], (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "Internal Server Error",
          });
        }
        if (result.rowCount === 0)
          return reject({
            status: 400,
            msg: "Delete promo failed, no promo deleted",
          });
        return resolve({
          status: 201,
          msg: `promo ${result.rows[0].code} deleted sucessfully`,
          data: { ...result.rows[0] },
        });
      });
    });
  },
};

module.exports = promosModel;
