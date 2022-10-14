const jwt = require("jsonwebtoken");
const isLogin = () => {
  return (req, res, next) => {
    const token = req.header("x-access-token");
    if (!token) return res.status(401).json({ msg: "You have to login first" });
    jwt.verify(token, process.env.SECRET_KEY, (error, decodedPayload) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: error.name });
      }
      req.userPayload = decodedPayload;
      next();
    });
  };
};
module.exports = isLogin;
