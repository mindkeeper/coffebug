const userModels = require("../model/users");

const userHandler = {
  get: async (req, res) => {
    try {
      const response = await userModels.getUsers(req.userPayload.id);
      res.status(200).json({ result: response.rows });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  create: async (req, res) => {
    try {
      const { body } = req;
      const response = await userModels.createUser(body);
      res.status(201).json({
        msg: `Congrats ${body.email}, your account created successfully`,
      });
    } catch (objError) {
      res
        .status(objError.statusCode || 500)
        .json({ error: objError.error.message });
    }
  },
  update: async (req, res) => {
    try {
      const response = await userModels.updateUser(
        req.body,
        req.userPayload.id,
        req.file
      );
      res.status(200).json({
        msg: `${response.rows[0].display_name}, your data has been updated`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "internal Server Error" });
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
  editPassword: async (req, res) => {
    try {
      const response = await userModels.editPassword(req.body, req.params.id);
      res.status(200).json({ msg: `Password Changed` });
    } catch (objError) {
      res
        .status(objError.statusCode || 500)
        .json({ msg: objError.error.message });
    }
  },
};

module.exports = userHandler;
