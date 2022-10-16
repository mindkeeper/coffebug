const jwt = require("jsonwebtoken");
const db = require("../config/postgre");
const isLogin = () => {
  return (req, res, next) => {
    const token = req.header("x-access-token");
    if (!token) return res.status(401).json({ msg: "You have to login first" });
    const query = "SELECT token FROM blacklist_token WHERE token = $1";
    db.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
      }
      if (result.rows.length !== 0)
        return res.status(403).json({ msg: "You have to login first" });
    });

    jwt.verify(token, process.env.SECRET_KEY, (error, decodedPayload) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: error.name });
      }
      req.userPayload = decodedPayload;
      req.token = token;
      next();
    });
  };
};
module.exports = isLogin;
