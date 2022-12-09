const db = require("../config/postgre");

const categoriesModel = {
  getCategories: () => {
    return new Promise((resolve, reject) => {
      const query = "select id, category_name from categories";
      db.query(query, (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        return resolve({
          status: 200,
          msg: "Category List",
          data: result.rows,
        });
      });
    });
  },
};

module.exports = categoriesModel;
