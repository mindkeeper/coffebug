const db = require("../config/postgre");

const productsModel = {
  getProducts: (queryParams) => {
    const { search, categories, minPrice, maxPrice, sort } = queryParams;
    let query =
      "select p.product_name, count(t.product_id) as sold, pt.type_name as categories, p.price, p.image, p.description from products p left join producttypes pt on p.type_id = pt.id left join transactions t on p.id = t.product_id ";
    let checkWhere = true;

    if (search) {
      query += `${
        checkWhere ? "WHERE" : "AND"
      } lower(p.product_name) like lower('%${search}%') `;
      checkWhere = false;
    }
    if (categories && categories !== "") {
      query += `${
        checkWhere ? "WHERE" : "AND"
      } lower(pt.type_name) like lower('${categories}') `;
      checkWhere = false;
    }
    if (minPrice && maxPrice) {
      query += `${
        checkWhere ? "WHERE" : "AND"
      } price between ${minPrice} and ${maxPrice} `;
      checkWhere = false;
    }
    if (minPrice && !maxPrice) {
      query += `${checkWhere ? "WHERE" : "AND"} price >= ${minPrice} `;
      checkWhere = false;
    }
    if (!minPrice && maxPrice) {
      query += `${checkWhere ? "WHERE" : "AND"} price <= ${maxPrice} `;
      checkWhere = false;
    }
    if (sort) {
      query += "group by p.id, pt.type_name ";
      if (sort.toLowerCase() === "popular")
        query += "order by count(t.product_id) desc";
      if (sort.toLowerCase() === "oldest") query += "order by p.created asc";
      if (sort.toLowerCase() === "newest") query += "order by p.created desc";
      if (sort.toLowerCase() === "cheapest") query += "order by p.price asc";
      if (sort.toLowerCase() === "priciest") query += "order by p.price desc";
    }
    return new Promise((resolve, reject) => {
      {
        //return resolve(limit);
        db.query(query, (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        });
      }
    });
  },
  createProducts: (body) => {
    return new Promise((resolve, reject) => {
      const query =
        "insert into products (product_name, price, image, type_id,description, created) values ($1, $2, $3, $4, $5, $6)";
      const { productname, price, image, typeid, description, created } = body;
      db.query(
        query,
        [productname, price, image, typeid, description, created],
        (err, queryResult) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          resolve(queryResult);
        }
      );
    });
  },
  updateProducts: (body, params) => {
    return new Promise((resolve, reject) => {
      let query = "update products set ";
      const input = [];
      Object.keys(body).forEach((element, index, array) => {
        if (index === array.length - 1) {
          query += `${element} = $${index + 1} where id = $${index + 2}`;
          input.push(body[element], params.id);
          return;
        }
        query += `${element} = $${index + 1}, `;
        input.push(body[element]);
      });
      //   res.json({ query, input });

      db.query(query, input)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  dropProducts: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from products where id = $1";
      db.query(query, [params.id], (error, response) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(response);
      });
    });
  },
};

module.exports = productsModel;
