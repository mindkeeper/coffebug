const productsModel = require("../model/products");
const resHelper = require("../helper/sendResponse");
const productsHandler = {
  get: async (req, res) => {
    try {
      const response = await productsModel.getProducts(req.query);
      return resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      return resHelper.error(res, error.status, error.error);
    }
  },
  create: async (req, res) => {
    try {
      const response = await productsModel.createProducts(req.body, req.file);
      return resHelper.success(res, response.status, response);
    } catch (error) {
      return resHelper.error(res, error.status, error.error);
    }
  },
  update: async (req, res) => {
    try {
      const response = await productsModel.updateProducts(
        req.body,
        req.params.id,
        req.file
      );
      return resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      return resHelper.error(res, error.status, error.error);
    }
  },
  drop: async (req, res) => {
    try {
      const response = await productsModel.dropProducts(req.params);
      return resHelper.success(res, response.status, response);
    } catch (error) {
      return resHelper.error(res, error.status, error.error);
    }
  },
};
module.exports = productsHandler;
