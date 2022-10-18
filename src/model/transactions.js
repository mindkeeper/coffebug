const db = require("../config/postgre");
const { error } = require("../helper/sendResponse");

const transactionsModel = {
  getTransactionById: (id) => {
    return new Promise((resolve, reject) => {
      const query =
        "select t.created_at, u.display_name, p.product_name, s.size , p.price,t.qty, pr.code, d.method_name, py.method_name, t.subtotal, t.total, st.status_name from transactions t join users_profile u on u.user_id = t.user_id join products p on p.id = t.product_id join sizes s on s.id = t.size_id join promos pr on pr.id = t.promo_id join deliveries d on d.id = t.delivery_id join payments py on py.id = t.payment_id join status st on st.id = t.status_id where t.id = $1";
      db.query(query, [id], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (result.rows.length === 0)
          return reject({ status: 404, msg: "Transaction cannot be found" });
        return resolve({
          status: 200,
          msg: "Transaction Details",
          data: { ...result.rows[0] },
        });
      });
    });
  },
  getAllTransactions: (id, queryParams) => {
    return new Promise((resolve, reject) => {
      const { page, limit } = queryParams;
      let link = "http://localhost:8080/api/transactions/history?";
      const countQuery =
        "select count(id) as count from transactions where user_id = $1";

      const query =
        "select t.created_at, u.display_name, p.product_name, s.size , p.price,t.qty, pr.code, d.method_name, py.method_name, t.subtotal, t.total, st.status_name from transactions t join users_profile u on u.user_id = t.user_id join products p on p.id = t.product_id join sizes s on s.id = t.size_id join promos pr on pr.id = t.promo_id join deliveries d on d.id = t.delivery_id join payments py on py.id = t.payment_id join status st on st.id = t.status_id where t.user_id = $1 order by created_at desc limit $2 offset $3";

      db.query(countQuery, [id], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (result.rows.length === 0)
          return reject({ status: 404, msg: "Data not found" });

        const totalData = parseInt(result.rows[0].count);
        const sqlLimit = !limit ? 3 : parseInt(limit);
        const sqlOffset =
          !page || page === "1" ? 0 : parseInt(page - 1) * limit;
        const currentPage = page ? parseInt(page) : 1;
        const totalPage =
          parseInt(sqlLimit) > totalData
            ? 1
            : Math.ceil(totalData / parseInt(sqlLimit));

        const prev =
          currentPage === 0
            ? null
            : link + `page=${currentPage - 1}&limit=${parseInt(sqlLimit)}`;

        const next =
          currentPage === totalPage
            ? null
            : link + `page=${currentPage + 1}&limit=${parseInt(sqlLimit)}`;
        const meta = {
          page: currentPage,
          totalPage,
          limit: parseInt(sqlLimit),
          totalData,
          prev,
          next,
        };

        db.query(query, [id, sqlLimit, sqlOffset], (error, result) => {
          if (error) {
            console.log(error);
            return reject({ status: 404, msg: "Internal Server Error" });
          }
          if (result.rows.length === 0)
            return reject({ status: 404, msg: "Data not found" });
          return resolve({
            status: 200,
            msg: "List products",
            data: result.rows,
            meta,
          });
        });
      });
    });
  },
  createTransactions: (body) => {
    return new Promise((resolve, reject) => {
      const query =
        "insert into transactions (user_id, product_id, size_id, qty, promo_id, subtotal, delivery_id, total, payment_id, status_id, created_at, updated_at) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, to_timestamp($11), to_timestamp($12)) returning *";
      const {
        user_id,
        product_id,
        size_id,
        qty,
        promo_id,
        subtotal,
        delivery_id,
        total,
        payment_id,
        status_id,
      } = body;
      const timeStamp = Date.now() / 1000;
      const values = [
        user_id,
        product_id,
        size_id,
        qty,
        promo_id,
        subtotal,
        delivery_id,
        total,
        payment_id,
        status_id,
        timeStamp,
        timeStamp,
      ];

      // return console.log(values);

      db.query(query, values, (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal server error" });
        }
        return resolve({
          status: 201,
          msg: "transaction created",
          data: { ...result.rows[0] },
        });
      });
    });
  },
  updateTransactions: (body, params) => {
    return new Promise((resolve, reject) => {
      const values = [];
      let query = "update transactions set ";
      Object.keys(body).forEach((key, index, array) => {
        if (index === array.length - 1) {
          query += `${key} = $${index + 1} where id  = $${
            index + 2
          } returning id`;
          values.push(body[key], params.id);
          return;
        }
        query += `${key} = $${index + 1}, `;
        values.push(body[key]);
      });

      db.query(query, values, (error, result) => {
        if (error) {
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (result.rowCount === 0)
          return reject({
            status: 400,
            msg: "transaction not found, update failed",
          });
        return resolve({
          status: 200,
          msg: `transaction with id ${result.rows[0].id} updated successfully`,
          data: { id: params.id, ...body },
        });
      });
    });
  },
  dropTransactions: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from transactions where id = $1 returning *";
      db.query(query, [params.id], (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "Internnal Server Error",
          });
        }
        if (result.rowCount === 0)
          return reject({
            status: 400,
            msg: "transaction not found, deletion failed",
          });
        return resolve({
          status: 200,
          msg: `transaction with id ${result.rows[0].id} deleted successfully`,
          data: { ...result.rows[0] },
        });
      });
    });
  },
};

module.exports = transactionsModel;
