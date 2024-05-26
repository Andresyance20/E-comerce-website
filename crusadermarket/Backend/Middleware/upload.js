//backend middleware needed for uploading pictures to posts

// /middleware/upload.js
const multer = require('multer');
const path = require('path');

// Configure storage, we will have to use a clould container somewhere here, like google clouds or azure
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/') 
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

// Filter files based on type
function fileFilter(req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only images are allowed!');
  }
}

// Initialize upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 3 }, 
  fileFilter: fileFilter
}).array('media', 3); // 'images' is the name of the form field, limit to 3 images

module.exports = upload;
