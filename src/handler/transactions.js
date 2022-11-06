const transactionsModel = require("../model/transactions");
const resHelper = require("../helper/sendResponse");

const transactionsHandler = {
  getTransactionById: async (req, res) => {
    try {
      const response = await transactionsModel.getTransactionById(
        req.params.id
      );
      resHelper.success(res, response.status, response);
    } catch (error) {
      resHelper.error(res, error.status, error);
    }
  },
  getTransactionsPending: async (req, res) => {
    try {
      const response = await transactionsModel.getPendingTransactions(
        req.query
      );
      resHelper.success(res, response.status, response);
    } catch (error) {
      resHelper.error(res, error.status, error);
    }
  },
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
        req.body.status_id,
        req.params.id
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
      return resHelper.error(res, error.status, error);
    }
  },
};

module.exports = transactionsHandler;
