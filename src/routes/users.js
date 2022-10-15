//imports
const express = require("express");
const usersRouter = express.Router();
const userHandler = require("../handler/users");
const isLogin = require("../middleware/isLogin");
const allowedRoles = require("../middleware/allowedRoles");
const uploads = require("../middleware/imageUpload");
const validate = require("../middleware/validate");
const allowed = [
  "username",
  "first_name",
  "last_name",
  "gender",
  "display_name",
  "birthday",
  "address",
  "image",
  "phone",
];
//get all users
usersRouter.get("/", isLogin(), allowedRoles("User"), userHandler.get);
usersRouter.post("/", userHandler.create);
usersRouter.patch(
  "/:id",
  isLogin(),
  allowedRoles("User"),
  uploads.single("image"),
  validate.patchBody(...allowed),
  userHandler.update
);
usersRouter.delete("/:id", isLogin(), allowedRoles("User"), userHandler.drop);
usersRouter.patch("/password/:id", userHandler.editPassword);
//export
module.exports = usersRouter;
