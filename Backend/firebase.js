const admin = require('firebase-admin');
require('dotenv').config();
const path = require('path');

const serviceAccount = require(path.resolve(process.env.SERVICE_ACCOUNT_KEY_PATH));
let bucket;

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
  });

  console.log('Firebase initialized successfully');

  bucket = admin.storage().bucket();
  console.log('Bucket accessed successfully:', bucket.name);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

module.exports = {
  bucket
};


