import admin from "firebase-admin";

function getAdminApp() {
  if (admin.apps.length) return admin.apps[0]!;

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY env var is not set");
  }

  return admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
  });
}

/** Lazy getter — only initializes when first accessed, not at import time */
export function getAdminDb() {
  return getAdminApp().firestore();
}
