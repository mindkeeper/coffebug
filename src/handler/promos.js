const promosModel = require("../model/promos");
const resHelper = require("../helper/sendResponse");

const promosHandler = {
  get: async (req, res) => {
    try {
      const response = await promosModel.getPromos(req.query);
      return resHelper.success(res, response.status, response);
    } catch (error) {
      resHelper.error(res, error.status, error);
    }
  },
  create: async (req, res) => {
    try {
      const response = await promosModel.createPromo(req.body);
      return resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      resHelper.error(res, error.status, error);
    }
  },
  update: async (req, res) => {
    try {
      const response = await promosModel.updatePromo(req.body, req.params);
      return resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      resHelper.error(res, error.status, error);
    }
  },
  drop: async (req, res) => {
    try {
      const response = await promosModel.dropPromo(req.params);
      return resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      resHelper.error(res, error.status, error);
    }
  },
};
module.exports = promosHandler;
