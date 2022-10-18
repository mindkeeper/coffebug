const express = require("express");
const {
  get,
  create,
  update,
  drop,
  getProductsbyId,
} = require("../handler/products");
const productsRouter = express.Router();
const isLogin = require("../middleware/isLogin");
const allowedRoles = require("../middleware/allowedRoles");
const validate = require("../middleware/validate");
const uploads = require("../middleware/imageUpload");

const allowed = {
  query: [
    "search",
    "categories",
    "minPrice",
    "maxPrice",
    "sort",
    "page",
    "limit",
  ],
  body: ["productname", "price", "category_id", "description"],
};
productsRouter.get("/:id", getProductsbyId);
productsRouter.get("/", validate.query(...allowed.query), get);

//post new data
productsRouter.post(
  "/",
  isLogin(),
  allowedRoles("Admin"),
  uploads.single("image"),
  validate.chekUpload(),
  validate.body(...allowed.body),
  create
);

//update data :: patch
productsRouter.patch(
  "/:id",
  isLogin(),
  allowedRoles("Admin"),
  uploads.single("image"),
  // validate.patchBody(...allowed.body),
  update
);

//delete
productsRouter.delete("/:id", isLogin(), allowedRoles("Admin"), drop);

module.exports = productsRouter;
