import admin from "firebase-admin"
import dotenv from "dotenv";

dotenv.config();

try {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") : undefined,
        })
    });
    console.log("Firebase Admin initialized successfully");
} catch (error) {
    console.error("Failed to initialize Firebase Admin:", error.message);
    console.warn("Server will start but Firebase features will not work.");
}

export default admin;