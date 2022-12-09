const express = require("express");
const validate = require("../middleware/validate");
const authsRouter = express.Router();
const authsHandler = require("../handler/auths");
const allowed = {
  login: ["email", "password"],
  register: ["email", "password", "phone"],
};

const isLogin = require("../middleware/isLogin");
authsRouter.post(
  "/register",
  validate.body(...allowed.register),
  authsHandler.register
);
authsRouter.post("/login", validate.body(...allowed.login), authsHandler.login);
authsRouter.get("/verify/:otp", authsHandler.verify);
authsRouter.delete("/logout", isLogin(), authsHandler.logout);
authsRouter.patch(
  "/forgot-password",
  validate.body("email"),
  authsHandler.forgotPassword
);
authsRouter.patch(
  "/reset-password",
  validate.body("otp", "newPassword", "confirmPassword"),
  authsHandler.resetPassword
);

module.exports = authsRouter;
