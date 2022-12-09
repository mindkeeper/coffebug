const authsModel = require("../model/auths");
const resHelper = require("../helper/sendResponse");
const { mailSender } = require("../helper/mail");

const authsHandler = {
  register: async (req, res) => {
    try {
      const register = await authsModel.register(req);
      const setSendMail = {
        to: req.body.email,
        subject: "Register Verification",
        template: "verifyEmail.html",
        link: `http://localhost:8080/api/auth/verify/${register.otp}`,
      };
      const response = await mailSender(setSendMail);
      resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      resHelper.error(res, error.status, error);
    }
  },
  verify: async (req, res) => {
    try {
      const response = await authsModel.verifyRegister(req);
      resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      resHelper.error(res, error.status, error);
    }
  },
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

  forgotPassword: async (req, res) => {
    try {
      const forgot = await authsModel.forgotPassword(req);
      const setSendMail = {
        to: req.body.email,
        subject: "Reset Password Verification",
        template: "verifyOtpPassword.html",
        otp: forgot.otp,
      };
      await mailSender(setSendMail);
      resHelper.success(res, 200, {
        status: 200,
        msg: "Success, please check email to reset your password",
      });
    } catch (error) {
      console.log(error);
      resHelper.error(res, error.status, error);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const response = await authsModel.resetPassword(req);
      resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      resHelper.error(res, error.status, error);
    }
  },
};
module.exports = authsHandler;
