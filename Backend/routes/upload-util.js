const express = require('express');
const { upload, uploadImageToFirebase } = require('../middleware/uploadMiddleware');
const authenticateUser  = require('../middleware/authentication');


const router = express.Router();

// Image upload route - supports all content types based on folder parameter
router.post('/upload-image', 
  authenticateUser, // Optional: Remove if you want to allow unauthenticated uploads
  upload.single('media'), // 'media' is the field name in the form
  uploadImageToFirebase, 
  (req, res) => {
    if (req.fileUrl) {
      // Return the file URL and media type (if available)
      const response = { 
        imageUrl: req.fileUrl 
      };
      
      // For gallery uploads, include the detected media type
      if (req.mediaType) {
        response.mediaType = req.mediaType;
      }
      
      return res.status(200).json(response);
    }
    return res.status(400).json({ msg: 'Please upload a valid file' });
  }
);

module.exports = router;