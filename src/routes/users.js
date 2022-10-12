//imports
const express = require("express");
const usersRouter = express.Router();
const userHandler = require("../handler/users");

//get all users
usersRouter.get("/:id", userHandler.get);
usersRouter.post("/", userHandler.create);
usersRouter.patch("/:id", userHandler.update);
usersRouter.delete("/:id", userHandler.drop);
//export
module.exports = usersRouter;
