const userModels = require("../model/users");
const resHelper = require("../helper/sendResponse");

const userHandler = {
  get: async (req, res) => {
    try {
      const response = await userModels.getUsers(req.userPayload.id);
      return resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      return resHelper.error(res, error.status, error);
    }
  },
  create: async (req, res) => {
    try {
      const { body } = req;
      const response = await userModels.createUser(body);
      return resHelper.success(res, response.status, response);
    } catch (error) {
      return resHelper.error(res, error.status, error);
    }
  },
  update: async (req, res) => {
    try {
      const response = await userModels.updateUser(
        req.body,
        req.userPayload.id,
        req.file
      );
      return resHelper.success(res, response.status, response);
    } catch (error) {
      return resHelper.error(res, error.status, error);
    }
  },
  drop: async (req, res) => {
    try {
      const response = await userModels.dropUser(req.userPayload.id);
      return resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      return resHelper.error(res, error.status, error);
    }
  },
  editPassword: async (req, res) => {
    try {
      const response = await userModels.editPassword(
        req.body,
        req.userPayload.id
      );
      return resHelper.success(res, response.status, response);
    } catch (error) {
      return resHelper.error(res, error.status, error);
    }
  },
};

module.exports = userHandler;
