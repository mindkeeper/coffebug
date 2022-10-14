const db = require("../config/postgre");

const productsModel = {
  getProducts: (queryParams) => {
    const { search, categories, minPrice, maxPrice, sort } = queryParams;
    let query =
      "select p.product_name, p.price, p.image, c.category_name, p.description, count(t.qty) as sold from products p join categories c on c.id = p.category_id join transactions t on t.product_id = p.id ";
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
      } lower(c.category_name) like lower('${categories}') `;
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
      query += "group by p.id, c.category_name ";
      if (sort.toLowerCase() === "popular")
        query += "order by count(t.qty) desc";
      if (sort.toLowerCase() === "oldest") query += "order by p.created_at asc";
      if (sort.toLowerCase() === "newest")
        query += "order by p.created_at desc";
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
      const timestamp = Date.now() / 1000;
      const query =
        "insert into products (product_name, price, image, category_id, description, created_at, updated_at) values ($1, $2, $3, $4, $5, to_timestamp($6), to_timestamp($7))";
      const { productname, price, image, category_id, description } = body;
      db.query(
        query,
        [
          productname,
          price,
          image,
          category_id,
          description,
          timestamp,
          timestamp,
        ],
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
