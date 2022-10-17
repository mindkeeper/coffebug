const express = require("express");
const transactionsRouter = express.Router();
const transactionsHandler = require("../handler/transactions");
const isLogin = require("../middleware/isLogin");
const allowedRoles = require("../middleware/allowedRoles");
const validate = require("../middleware/validate");
const isAllowed = [
  "user_id",
  "product_id",
  "size_id",
  "qty",
  "promo_id",
  "subtotal",
  "delivery_id",
  "total",
  "payment_id",
  "status_id",
];

transactionsRouter.get(
  "/history",
  isLogin(),
  allowedRoles("User"),
  transactionsHandler.get
);
transactionsRouter.post(
  "/",
  isLogin(),
  allowedRoles("Admin"),
  validate.body(...isAllowed),
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
