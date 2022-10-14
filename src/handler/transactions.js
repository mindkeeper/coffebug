const transactionsModel = require("../model/transactions");

const transactionsHandler = {
  get: async (req, res) => {
    try {
      const response = await transactionsModel.getAllTransactions(
        req.userPayload.id
      );
      res.status(200).json({ result: response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  create: async (req, res) => {
    try {
      const response = await transactionsModel.createTransactions(
        req.body,
        req.userPayload.id
      );
      res.status(201).json({ result: response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  update: async (req, res) => {
    try {
      const response = await transactionsModel.updateTransactions(
        req.body,
        req.params
      );
      res.status(200).json({ result: response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  drop: async (req, res) => {
    try {
      const response = await transactionsModel.dropTransactions(req.params);
      res.status(200).json({ result: response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
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
