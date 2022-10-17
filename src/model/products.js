const db = require("../config/postgre");

const productsModel = {
  getProducts: (queryParams) => {
    return new Promise((resolve, reject) => {
      const { search, categories, minPrice, maxPrice, sort, limit, page } =
        queryParams;
      let query =
        "select p.product_name, p.price, p.image, c.category_name, p.description from products p join categories c on c.id = p.category_id left join transactions t on t.product_id = p.id ";
      let countQuery =
        "select count(*) as count from products p join categories c on c.id = p.category_id left join transactions t on t.product_id = p.id ";

      let checkWhere = true;
      let link = "http://localhost:8080/api/products?";

      if (search) {
        link += `search${search}&`;
        query += `${
          checkWhere ? "WHERE" : "AND"
        } lower(p.product_name) like lower('%${search}%') `;
        countQuery += `${
          checkWhere ? "WHERE" : "AND"
        } lower(p.product_name) like lower('%${search}%') `;
        checkWhere = false;
      }

      if (categories && categories !== "") {
        query += `${
          checkWhere ? "WHERE" : "AND"
        } lower(c.category_name) like lower('${categories}') `;

        countQuery += `${
          checkWhere ? "WHERE" : "AND"
        } lower(c.category_name) like lower('${categories}') `;

        checkWhere = false;
        link += `categories=${categories}&`;
      }

      if (minPrice && maxPrice) {
        query += `${
          checkWhere ? "WHERE" : "AND"
        } price between ${minPrice} and ${maxPrice} `;

        countQuery += `${
          checkWhere ? "WHERE" : "AND"
        } price between ${minPrice} and ${maxPrice} `;
        checkWhere = false;

        link += `minPrice=${minPrice}&maxPrice=${maxPrice}&`;
      }

      if (minPrice && !maxPrice) {
        query += `${checkWhere ? "WHERE" : "AND"} price >= ${minPrice} `;
        countQuery += `${checkWhere ? "WHERE" : "AND"} price >= ${minPrice} `;
        checkWhere = false;
        link += `minPrice=${minPrice}&`;
      }
      if (!minPrice && maxPrice) {
        query += `${checkWhere ? "WHERE" : "AND"} price <= ${maxPrice} `;
        countQuery += `${checkWhere ? "WHERE" : "AND"} price <= ${maxPrice} `;
        checkWhere = false;
        link += `maxPrice=${maxPrice}&`;
      }
      if (sort) {
        query += "group by p.id, c.category_name ";
        if (sort.toLowerCase() === "popular") {
          query += "order by count(t.qty) desc ";
          link += "sort=popular&";
        }
        if (sort.toLowerCase() === "oldest") {
          query += "order by p.created_at asc ";
          link += "sort=oldest&";
        }
        if (sort.toLowerCase() === "newest") {
          query += "order by p.created_at desc ";
          link += "sort=newest&";
        }
        if (sort.toLowerCase() === "cheapest") {
          query += "order by p.price asc ";
          link += "sort=cheapest&";
        }
        if (sort.toLowerCase() === "priciest") {
          query += "order by p.price desc ";
          link += "sort=prciest&";
        }
      }
      query += "limit $1 offset $2";
      console.log(query);
      console.log(link);
      const sqlLimit = limit ? limit : 10;
      const sqlOffset =
        !page || page === "1" ? 0 : (parseInt(page) - 1) * parseInt(sqlLimit);

      // console.log(countQuery);
      console.log(sqlLimit);
      db.query(countQuery, (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            error: { msg: "internal Server Error" },
          });
        }
        const totalData = result.rows[0].count;
        const currentPage = page ? parseInt(page) : 1;
        const totalPage =
          parseInt(sqlLimit) > totalData
            ? 1
            : Math.ceil(totalData / parseInt(sqlLimit));

        const prev =
          currentPage - 1 <= 0
            ? null
            : link + `page=${currentPage - 1}&limit=${parseInt(sqlLimit)}`;

        const next =
          currentPage + 1 > totalPage
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
        console.log(totalPage, currentPage);
        db.query(query, [sqlLimit, sqlOffset], (error, result) => {
          if (error) {
            console.log(error);
            return reject({
              status: 500,
              error: { msg: "internal Server Error" },
            });
          }
          if (result.rows.length === 0)
            return reject({
              status: 404,
              error: { msg: "Data Not Found" },
            });
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
  createProducts: (body, file) => {
    return new Promise((resolve, reject) => {
      const timestamp = Date.now() / 1000;
      const query =
        "insert into products (product_name, price, image, category_id, description, created_at, updated_at) values ($1, $2, $3, $4, $5, to_timestamp($6), to_timestamp($7)) returning product_name";
      const { productname, price, category_id, description } = body;
      const imageUrl = `/images/${file.filename}`;
      db.query(
        query,
        [
          productname,
          price,
          imageUrl,
          category_id,
          description,
          timestamp,
          timestamp,
        ],
        (error, queryResult) => {
          if (error) {
            console.log(error);
            return reject({
              status: 500,
              error: { msg: "Internal Server Error" },
            });
          }
          const productName = queryResult.rows[0].product_name;
          resolve({ status: 201, msg: `${productName} added to database` });
        }
      );
    });
  },
  updateProducts: (body, id, file) => {
    return new Promise((resolve, reject) => {
      const timestamp = Date.now() / 1000;
      let query = "update products set ";
      const input = [];
      if (file) {
        if (Object.keys(body).length === 0) {
          const imageUrl = `/image/${file.filename}`;
          query += `image = '${imageUrl}', updated_at = to_timestamp($1) where id = $2 returning product_name`;
          input.push(timestamp, id);
        }
        if (Object.keys(body).length > 0) {
          const imageUrl = `/image/${file.filename}`;
          query += `image = '${imageUrl}', `;
        }
      }
      //
      Object.keys(body).forEach((element, index, array) => {
        if (index === array.length - 1) {
          query += `${element} = $${index + 1}, updated_at = to_timestamp($${
            index + 2
          }) where id = $${index + 3} returning product_name`;
          input.push(body[element], timestamp, id);
          return;
        }
        query += `${element} = $${index + 1}, `;
        input.push(body[element]);
      });
      db.query(query, input, (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            error: { msg: "Internal server error" },
          });
        }
        return resolve({
          status: 200,
          msg: `${result.rows[0].product_name} updated`,
        });
      });
    });
  },
  dropProducts: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from products where id = $1 returning product_name";
      db.query(query, [params.id], (error, response) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            error: { msg: "Internal server error" },
          });
        }
        return resolve({
          status: 200,
          msg: `${response.rows[0].product_name} deleted`,
        });
      });
    });
  },
};

module.exports = productsModel;
