const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const { PORT } = process.env;
// const db = require("./src/config/postgre");
const mainRouter = require("./src/routes/main");
const server = express();
const cors = require("cors");
// require("./src/config/redis");

server.use(cors());
server.use(express.json());
server.use(express.static("./public/images"));
//parser encoded
server.use(express.urlencoded({ extended: false }));
server.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
server.use(mainRouter);
server.listen(PORT, () => {
  console.log(`Server Running at Port ${PORT}`);
});
