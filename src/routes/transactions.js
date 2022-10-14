const express = require("express");
const transactionsRouter = express.Router();
const transactionsHandler = require("../handler/transactions");
const isLogin = require("../middleware/isLogin");
const allowedRoles = require("../middleware/allowedRoles");

transactionsRouter.get(
  "/history",
  isLogin(),
  allowedRoles("User"),
  transactionsHandler.get
);
transactionsRouter.post(
  "/",
  isLogin(),
  allowedRoles("User", "Admin"),
  transactionsHandler.create
);
transactionsRouter.patch(
  "/:id",
  isLogin(),
  allowedRoles("Admin"),
  transactionsHandler.update
);
transactionsRouter.delete(
  "/:id",
  isLogin(),
  allowedRoles("Admin"),
  transactionsHandler.drop
);
//export
module.exports = transactionsRouter;
