const multer = require('multer');
const { bucket } = require('../firebase');
const path = require('path');
const Errors = require('../errors');

// Set up multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // Increased to 20MB to accommodate videos
  },
  fileFilter: (req, file, cb) => {
    const folder = req.query.folder || 'misc';
    
    // Check file type based on the folder
    if (folder.startsWith('community/gallery')) {
      // For gallery uploads, allow images and videos
      const imageTypes = /jpeg|jpg|png|gif|webp/;
      const videoTypes = /mp4|mov|webm|avi/;
      
      const extension = path.extname(file.originalname).toLowerCase().substring(1);
      const isImage = imageTypes.test(extension) && /^image\//.test(file.mimetype);
      const isVideo = videoTypes.test(extension) && /^video\//.test(file.mimetype);
      
      if (isImage || isVideo) {
        // Store media type for later use
        req.mediaType = isImage ? 'image' : 'video';
        return cb(null, true);
      } else {
        return cb(new Errors.BadRequestError('For gallery uploads, only images (JPEG, PNG, GIF, WebP) and videos (MP4, MOV, WebM, AVI) are allowed.'));
      }
    } 
    else if (folder.startsWith('community/blog')) {
      // For blog uploads, allow only images
      const imageTypes = /jpeg|jpg|png|gif|webp/;
      const extension = path.extname(file.originalname).toLowerCase().substring(1);
      const isImage = imageTypes.test(extension) && /^image\//.test(file.mimetype);
      
      if (isImage) {
        req.mediaType = 'image';
        return cb(null, true);
      } else {
        return cb(new Errors.BadRequestError('For blog uploads, only image files are allowed.'));
      }
    }
    else {
      // For other uploads (products, etc.), use original validation
      const filetypes = /jpeg|jpg|png|gif/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        return cb(new Errors.BadRequestError('Only image files are allowed!'));
      }
    }
  }
});

// Update the uploadImageToFirebase function to accept a folder parameter
const uploadImageToFirebase = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }
    
    // Get the folder from query params, or use 'misc' as fallback
    const folder = req.query.folder || 'misc';
    
    // Create sanitized folder name (remove any path traversal attempts)
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9-_/]/g, '');
    
    // For gallery posts, include media type in path if available
    let fileName;
    if (folder.startsWith('community/gallery') && req.mediaType) {
      fileName = `${sanitizedFolder}/${req.mediaType}s/${Date.now()}-${req.file.originalname}`;
    } else {
      fileName = `${sanitizedFolder}/${Date.now()}-${req.file.originalname}`;
    }
    
    const fileUpload = bucket.file(fileName);
    
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    });
    
    blobStream.on('error', (error) => {
      console.error(error);
      next(new Error('Something went wrong with the upload'));
    });
    
    blobStream.on('finish', async () => {
      // Make the file public
      await fileUpload.makePublic();
      
      // Get the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      req.fileUrl = publicUrl;
      
      // Also store media type for gallery posts
      if (folder.startsWith('community/gallery')) {
        req.mediaType = req.mediaType || (req.file.mimetype.startsWith('image/') ? 'image' : 'video');
      }
      
      next();
    });
    
    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    next(new Error('Error uploading to Firebase'));
  }
};


module.exports = { upload, uploadImageToFirebase };