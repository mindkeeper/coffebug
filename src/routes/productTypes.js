const express = require("express");
const productTypesRouter = express.Router();
const productTypesHandler = require("../handler/productTypes");

productTypesRouter.get("/", productTypesHandler.get);
productTypesRouter.post("/", productTypesHandler.create);
productTypesRouter.patch("/:id", productTypesHandler.update);
productTypesRouter.delete("/:id", productTypesHandler.drop);

module.exports = productTypesRouter;
