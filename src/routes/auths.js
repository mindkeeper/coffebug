const express = require("express");
const validate = require("../middleware/validate");
const authsRouter = express.Router();
const authsHandler = require("../handler/auths");
const allowed = { login: ["email", "password"] };

const isLogin = require("../middleware/isLogin");
authsRouter.post("/login", validate.body(...allowed.login), authsHandler.login);
authsRouter.delete("/logout", isLogin(), authsHandler.logout);

module.exports = authsRouter;
