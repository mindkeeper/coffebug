const express = require("express");
const db = require("./src/config/postgre");
const mainRouter = require("./src/routes/main");
const server = express();
const PORT = 8080;

// http route
db.connect()
  .then(() => {
    console.log("Connect Success");

    //semua routes lewat main

    //parser json
    server.use(express.json());
    //parser encoded
    server.use(express.urlencoded({ extended: false }));
    server.use(mainRouter);
    server.listen(PORT, () => {
      console.log(`running at port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
