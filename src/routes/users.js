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
const cloudinaryUpload = require("../middleware/cloudinary");
//get all users
usersRouter.get("/", isLogin(), allowedRoles("User"), userHandler.get);
usersRouter.post("/register", userHandler.create);
usersRouter.patch(
  "/edit-profile",
  isLogin(),
  allowedRoles("User"),
  uploads,
  cloudinaryUpload,
  validate.patchBody(...allowed),
  userHandler.update
);
usersRouter.delete(
  "/delete",
  isLogin(),
  allowedRoles("User"),
  userHandler.drop
);
usersRouter.patch("/password/", isLogin(), userHandler.editPassword);
//export
module.exports = usersRouter;
