const authsModel = require("../model/auths");

const authsHandler = {
  login: async (req, res) => {
    try {
      const response = await authsModel.login(req.body);
      res.status(200).json({
        msg: "Login Successful",
        data: { token: response.token, payload: response.payload },
      });
    } catch (objError) {
      return res
        .status(objError.statusCode || 500)
        .json({ msg: objError.error.message });
    }
  },
};
module.exports = authsHandler;
