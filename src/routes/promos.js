const express = require("express");
const promosRouter = express.Router();
const promosHandler = require("../handler/promos");

promosRouter.get("/", promosHandler.get);
// promosRouter.get("/search", promosHandler.search);
promosRouter.post("/", promosHandler.create);
promosRouter.patch("/:id", promosHandler.update);
promosRouter.delete("/:id", promosHandler.drop);

//export
module.exports = promosRouter;
