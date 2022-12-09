const jwt = require("jsonwebtoken");
const db = require("../config/postgre");
const resHelper = require("../helper/sendResponse");
const isLogin = () => {
  return (req, res, next) => {
    const token = req.header("x-access-token");
    if (!token)
      return resHelper.error(res, 403, {
        status: 403,
        msg: "You have to login first",
      });

    const query = "SELECT token FROM blacklist_token WHERE token = $1";
    db.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return resHelper.error(res, 500, {
          status: 500,
          msg: "Internal Server Error",
        });
      }
      if (result.rows.length !== 0)
        return resHelper.error(res, 403, {
          status: 403,
          msg: "You have to login first",
        });

      jwt.verify(token, process.env.SECRET_KEY, (error, decodedPayload) => {
        if (error) {
          console.log(error);
          return resHelper.error(res, 403, {
            status: 403,
            msg: "You have to login first",
          });
        }
        req.userPayload = decodedPayload;
        next();
      });
    });
  };
};
module.exports = isLogin;
