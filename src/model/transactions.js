const db = require("../config/postgre");

const transactionsModel = {
  getAllTransactions: (params) => {
    return new Promise((resolve, reject) => {
      const query =
        "select t.transactionsid, u.username, t.payment, p.productname, pr.promoname, d.name as delivery_name from transactions t join users u on u.userid  = t.userid join products p on p.productid = t.productid join promos pr on pr.promoid  = t.promoid join delivery d on d.id  = t.delivery_id where t.userid = $1;";
      db.query(query, [params.id], (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  },
  createTransactions: (body) => {
    return new Promise((resolve, reject) => {
      const query =
        "insert into transactions(created, userid, productid, promoid, paymentmethodid, payment, changepayment, delivery_id, pick_up_time, pick_up_date) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
      const {
        created,
        userid,
        productid,
        promoid,
        paymentmethodid,
        payment,
        changepayment,
        delivery_id,
        pick_up_time,
        pick_up_date,
      } = body;
      const promo = !promoid || promoid === "" ? null : promoid;
      const values = [
        created,
        userid,
        productid,
        promo,
        paymentmethodid,
        payment,
        changepayment,
        delivery_id,
        pick_up_time,
        pick_up_date,
      ];

      // return console.log(values);

      db.query(query, values, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  },
  updateTransactions: (body, params) => {
    return new Promise((resolve, reject) => {
      const values = [];
      let query = "update transactions set ";
      Object.keys(body).forEach((key, index, array) => {
        if (index === array.length - 1) {
          query += `${key} = $${index + 1} where transactionsid  = $${
            index + 2
          }`;
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
  dropTransactions: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from transactions where transactionsid = $1";
      db.query(query, [params.id], (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  },
};

module.exports = transactionsModel;
