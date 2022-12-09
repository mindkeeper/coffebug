const express = require("express");
const categoriesHandler = require("../handler/categories");
const categoriesRouter = express.Router();

categoriesRouter.get("/", categoriesHandler.getCategories);

module.exports = categoriesRouter;
