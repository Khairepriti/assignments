const multer = require('multer');
const fs = require('fs');

// Configure multer
const configureMulter = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Check if the destination directory exists, and create it if not
      fs.mkdir('uploads/', { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating destination directory:', err);
        }

        cb(null, 'uploads/');
      });
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    }
  });

  return multer({ storage });
};

module.exports = configureMulter;
