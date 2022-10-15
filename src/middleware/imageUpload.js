const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()} - ${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "image/jpg" || file.mimetype !== "image/png") {
    cb(null, false);
    return new Error({ error: "JPG/PNG only" });
  }
  cb(null, true);
};

const uploads = multer({
  storage,
});

module.exports = uploads;
