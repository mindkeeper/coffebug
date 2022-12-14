const express = require("express");
const productsRouter = require("./products");
const promosRouter = require("./promos");
const transactionsRouter = require("./transactions");
const usersRouter = require("./users");
const authsRouter = require("./auths");
const categoriesRouter = require("./categories");

const prefix = "/api";

const mainRouter = express.Router();
mainRouter.use(`${prefix}/products`, productsRouter);
mainRouter.use(`${prefix}/promos`, promosRouter);
mainRouter.use(`${prefix}/transactions`, transactionsRouter);
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/auths`, authsRouter);
mainRouter.use(`${prefix}/categories`, categoriesRouter);

//
mainRouter.get(`/`, (_, res) => {
  res.json({ msg: "Welcome" });
});

module.exports = mainRouter;
