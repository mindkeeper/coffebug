const productsModel = require("../model/products");

const productsHandler = {
  get: async (req, res) => {
    try {
      const response = await productsModel.getProducts(req.query);
      if (response.rows.length === 0)
        return res.status(404).json({ msg: "Data Not Found" });
      return res.status(200).json({ result: response.rows });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: "Internal Server Error",
      });
    }
  },
  create: async (req, res) => {
    try {
      const response = await productsModel.createProducts(req.body);
      return res
        .status(201)
        .json({ result: `${req.body.productname} Added Successfully` });
    } catch (error) {
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  update: async (req, res) => {
    try {
      const response = await productsModel.updateProducts(req.body, req.params);
      if (response.rowCount === 0)
        return res.status(404).json({ msg: "Data Not Found" });
      return res
        .status(200)
        .json({ result: `${req.body.product_name} Changed Successfully` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  drop: async (req, res) => {
    try {
      const response = await productsModel.dropProducts(req.params);
      if (response.rowCount === 0)
        return res.status(404).json({ msg: "Data Not Found" });
      return res.status(200).json({ result: `Item Deleted Successfully` });
    } catch (error) {
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};
module.exports = productsHandler;
