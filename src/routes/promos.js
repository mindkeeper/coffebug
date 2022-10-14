const express = require("express");
const promosRouter = express.Router();
const promosHandler = require("../handler/promos");
const isLogin = require("../middleware/isLogin");
const allowedRoles = require("../middleware/allowedRoles");
promosRouter.get("/", promosHandler.get);
// promosRouter.get("/search", promosHandler.search);
promosRouter.post("/", isLogin(), allowedRoles("Admin"), promosHandler.create);
promosRouter.patch(
  "/:id",
  isLogin(),
  allowedRoles("Admin"),
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
