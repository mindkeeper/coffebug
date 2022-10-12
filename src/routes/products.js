const express = require("express");
const { get, create, update, drop } = require("../handler/products");
const productsRouter = express.Router();

productsRouter.get("/", get);

//post new data
productsRouter.post("/", create);

//update data :: patch
productsRouter.patch("/:id", update);

//delete
productsRouter.delete("/:id", drop);

module.exports = productsRouter;
