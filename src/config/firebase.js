const admin = require("firebase-admin");
const { env } = require("./env");

let app;

function getFirebaseApp() {
  if (!app) {
    app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: env.firebaseStorageBucket || undefined
    });
  }

  return app;
}

function getFirestore() {
  return getFirebaseApp().firestore();
}

module.exports = { getFirebaseApp, getFirestore };
