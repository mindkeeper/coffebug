const express = require("express");
const authsRouter = express.Router();
const authsHandler = require("../handler/auths");
const isLogin = require("../middleware/isLogin");
authsRouter.patch("/login", authsHandler.login);
authsRouter.delete("/logout", isLogin(), authsHandler.logout);

module.exports = authsRouter;
