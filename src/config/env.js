const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  emisor: {
    nit: process.env.EMISOR_NIT || "0000-000000-000-0",
    nrc: process.env.EMISOR_NRC || "00000-0",
    razonSocial: process.env.EMISOR_RAZON_SOCIAL || "Empresa por defecto",
    direccion: process.env.EMISOR_DIRECCION || "San Salvador, El Salvador",
    giro: process.env.EMISOR_GIRO || "Comercio"
  }
};

module.exports = { env };
