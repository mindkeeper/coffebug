const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    const fileName = `${file.fieldname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});
const multerOption = {
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/jpeg"
    )
      return cb(new Error("Invalid data type"));
    cb(null, true);
  },
  limits: { fileSize: 1 * 1024 * 1024 },
};

const upload = multer(multerOption).single("image");
const multerHandler = (req, res, next) => {
  upload(req, res, (error) => {
    if (error) {
      console.log("error found : ", error);
      if (error.code === "LIMIT_FILE_SIZE")
        return res.status(400).json({
          status: 400,
          msg: "File too large, image must be 2MB or lower",
          error: error.code,
        });
      if (error.code === "WRONG_EXSTENSION")
        return res.status(415).json({
          status: 415,
          msg: "Only .jpg, .jpeg and .png format allowed",
          error: error.code,
        });
      return res.status(500).json({
        msg: `Internal Server Error`,
        error,
      });
    }
    next();
  });
};

module.exports = multerHandler;
