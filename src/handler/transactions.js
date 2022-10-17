const transactionsModel = require("../model/transactions");
const resHelper = require("../helper/sendResponse");

const transactionsHandler = {
  get: async (req, res) => {
    try {
      const response = await transactionsModel.getAllTransactions(
        req.userPayload.id,
        req.query
      );
      return resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      return resHelper.error(res, error.status, error);
    }
  },
  create: async (req, res) => {
    try {
      const response = await transactionsModel.createTransactions(req.body);
      return resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      return resHelper.error(res, error.status, error);
    }
  },
  update: async (req, res) => {
    try {
      const response = await transactionsModel.updateTransactions(
        req.body,
        req.params
      );
      return resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      return resHelper.error(res, error.status, error);
    }
  },
  drop: async (req, res) => {
    try {
      const response = await transactionsModel.dropTransactions(req.params);
      return resHelper.success(res, response.status, response);
    } catch (error) {
      return resHelper.success(res, error.status, error);
    }
  },
  bestSeller: async (req, res) => {
    try {
      const response = await transactionsModel.getBestSeller();
      res.status(200).json({ result: response.rows });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};

module.exports = transactionsHandler;
