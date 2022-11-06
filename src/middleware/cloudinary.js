const cloudinary = require("../config/cloudinary");
const DatauriParser = require("datauri/parser");
const path = require("path");
const uploader = async (req, res, next) => {
  const { userPayload, file } = req;
  if (!file) return next();
  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalname).toString();
  const dataUri = parser.format(ext, buffer);
  const cloudinaryOpt = {
    public_id: `user_${userPayload.id}`,
    folder: "Coffebug",
  };
  try {
    const result = await cloudinary.uploader.upload(
      dataUri.content,
      cloudinaryOpt
    );
    req.file = result;
    next();
  } catch (error) {
    console.log(error);
    res.status(415).json({ status: 415, msg: error.message });
  }
};

module.exports = uploader;
