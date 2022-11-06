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
const cloudinaryUpload = require("../middleware/cloudinary");

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
  uploads,
  cloudinaryUpload,
  validate.chekUpload(),
  validate.body(...allowed.body),
  create
);

//update data :: patch
productsRouter.patch(
  "/:id",
  isLogin(),
  allowedRoles("Admin"),
  uploads,
  cloudinaryUpload,
  // validate.patchBody(...allowed.body),
  update
);

//delete
productsRouter.delete("/:id", isLogin(), allowedRoles("Admin"), drop);
productsRouter.post("/try/cloud", uploads, (req, res) => {
  console.log(req.file);
  res.status(204).send();
});
module.exports = productsRouter;
