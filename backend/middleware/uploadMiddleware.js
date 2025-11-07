const multer = require('multer');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// Set up file filter (optional, but good practice)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.ms-powerpoint' || file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type. Only PDF and PPT are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  // fileFilter: fileFilter, // Uncomment to enable file filtering
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});

module.exports = upload;