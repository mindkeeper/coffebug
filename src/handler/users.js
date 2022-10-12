const userModels = require("../model/users");

const userHandler = {
  get: async (req, res) => {
    try {
      const response = await userModels.getUsers(req.params);
      res.status(200).json({ result: response.rows });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  create: async (req, res) => {
    try {
      const response = await userModels.createUser(req.body);
      res.status(201).json({ result: response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  update: async (req, res) => {
    try {
      const response = await userModels.updateUser(req.body, req.params);
      res.status(200).json({ result: response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  drop: async (req, res) => {
    try {
      const response = await userModels.dropUser(req.params);
      res.status(200).json({ result: response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};

module.exports = userHandler;
