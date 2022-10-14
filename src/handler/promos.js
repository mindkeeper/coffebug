const promosModel = require("../model/promos");

const promosHandler = {
  get: async (req, res) => {
    try {
      const response = await promosModel.getPromos(req.query);
      if (response.rows.length === 0)
        return res.status(404).json({ msg: "Data Not Found" });
      return res.status(200).json({ result: response.rows });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  create: async (req, res) => {
    try {
      const response = await promosModel.createPromo(req.body);
      return res.status(201).json({
        msg: `Prommo ${req.body.code.toUpperCase()} Added Successfully`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  update: async (req, res) => {
    try {
      const response = await promosModel.updatePromo(req.body, req.params);
      res.status(200).json({ result: "Promo changed successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  drop: async (req, res) => {
    try {
      const response = await promosModel.dropPromo(req.params);
      if (response.rowCount === 0)
        return res.status(404).json({ msg: "Data Not Found, No Data Deleted" });
      return res.status(200).json({ msg: "Data Deleted Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};
module.exports = promosHandler;
