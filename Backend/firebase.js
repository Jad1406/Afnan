const admin = require('firebase-admin');
require('dotenv').config();
const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com'
});

const bucket = admin.storage().bucket();

module.exports = {
  bucket
};