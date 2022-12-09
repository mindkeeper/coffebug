const categoriesModel = require("../model/categories");
const resHelper = require("../helper/sendResponse");

const categoriesHandler = {
  getCategories: async (req, res) => {
    try {
      const response = await categoriesModel.getCategories();
      resHelper.success(res, response.status, response);
    } catch (error) {
      resHelper.error(res, error.status, error);
    }
  },
};

module.exports = categoriesHandler;
