// const multer = require('multer');
// const path = require('path');

// // Directory to save video files
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../uploads'));
//   },
//   filename: function (req, file, cb) {
//     const timestamp = Date.now();
//     const ext = path.extname(file.originalname);
//     cb(null, `session_${timestamp}${ext}`);
//   }
// });

// const upload = multer({ storage });

// module.exports = upload;
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure 'uploads' directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;

