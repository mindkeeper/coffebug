const express = require("express");
const promosRouter = express.Router();
const promosHandler = require("../handler/promos");
const isLogin = require("../middleware/isLogin");
const allowedRoles = require("../middleware/allowedRoles");
const validate = require("../middleware/validate");

const allowed = {
  query: ["code", "page", "limit"],
  body: ["code", "discount", "description", "duration"],
};
promosRouter.get(
  "/",
  isLogin(),
  allowedRoles("User", "Admin"),
  validate.query(...allowed.query),
  promosHandler.get
);
// promosRouter.get("/search", promosHandler.search);
promosRouter.post(
  "/",
  isLogin(),
  allowedRoles("Admin"),
  validate.body(...allowed.body),
  promosHandler.create
);
promosRouter.patch(
  "/:id",
  isLogin(),
  allowedRoles("Admin"),
  validate.patchBody(...allowed.body),
  promosHandler.update
);
promosRouter.delete(
  "/:id",
  isLogin(),
  allowedRoles("Admin"),
  promosHandler.drop
);

//export
module.exports = promosRouter;
