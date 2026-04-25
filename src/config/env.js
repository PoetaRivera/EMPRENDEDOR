const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT || 3000),
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

module.exports = { env };
