const authsModel = require("../model/auths");
const resHelper = require("../helper/sendResponse");

const authsHandler = {
  login: async (req, res) => {
    try {
      const response = await authsModel.login(req.body);
      return resHelper.success(res, response.status, response);
    } catch (error) {
      return resHelper.error(res, error.status, error.error);
    }
  },

  logout: async (req, res) => {
    try {
      const response = await authsModel.logout(req.header("x-access-token"));
      return resHelper.success(res, response.status, response);
    } catch (error) {
      return resHelper.error(res, error.status, error.error);
    }
  },
};
module.exports = authsHandler;
