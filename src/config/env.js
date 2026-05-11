const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

module.exports = { env };
