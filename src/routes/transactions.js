const express = require("express");
const transactionsRouter = express.Router();
const transactionsHandler = require("../handler/transactions");
//export
module.exports = transactionsRouter;

transactionsRouter.get("/:id", transactionsHandler.get);
transactionsRouter.post("/", transactionsHandler.create);
transactionsRouter.patch("/:id", transactionsHandler.update);
transactionsRouter.delete("/:id", transactionsHandler.drop);
