const producttypesModel = require("../model/productTypes");

const productTypesHandler = {
  get: async (req, res) => {
    try {
      const response = await producttypesModel.getProductTypes();
      res.status(200).json({ result: response.rows });
    } catch (error) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  create: async (req, res) => {
    try {
      const response = await producttypesModel.createProductType(req.body);
      res.status(201).json({ result: response });
    } catch (error) {
      res.status(500).json({ msg: "internal Server Error" });
    }
  },
  update: async (req, res) => {
    try {
      const response = await producttypesModel.updateProductType(
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
      const response = await producttypesModel.dropProductType(req.params);
      res.status(200).json({ result: response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};

module.exports = productTypesHandler;
