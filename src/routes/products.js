const express = require("express");
const { get, create, update, drop } = require("../handler/products");
const productsRouter = express.Router();
const isLogin = require("../middleware/isLogin");
const allowedRoles = require("../middleware/allowedRoles");

productsRouter.get("/", get);

//post new data
productsRouter.post("/", isLogin(), allowedRoles("Admin"), create);

//update data :: patch
productsRouter.patch("/:id", isLogin(), allowedRoles("Admin"), update);

//delete
productsRouter.delete("/:id", isLogin(), allowedRoles("Admin"), drop);

module.exports = productsRouter;
