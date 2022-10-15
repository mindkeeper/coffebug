const response = {
  success: (res, code, result) => {
    res.status(code).json({ result });
  },
  error: (res, code, error) => {
    res.status(code).json({ error });
  },
};
module.exports = response;
