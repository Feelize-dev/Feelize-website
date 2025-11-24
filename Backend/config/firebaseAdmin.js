import admin from "firebase-admin"

// Check if Firebase credentials are properly configured
const isFirebaseConfigured = 
    process.env.FIREBASE_PROJECT_ID && 
    process.env.FIREBASE_PROJECT_ID !== 'your-firebase-project-id' &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_CLIENT_EMAIL !== 'your-service-account@your-project.iam.gserviceaccount.com' &&
    process.env.FIREBASE_PRIVATE_KEY &&
    !process.env.FIREBASE_PRIVATE_KEY.includes('Replace-This-With-Your-Actual-Private-Key');

if (isFirebaseConfigured) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            })
        });
        console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
        console.error('   Please check your Firebase credentials in the .env file');
    }
} else {
    console.warn('⚠️  Firebase Admin SDK not initialized - credentials not configured');
    console.warn('   Authentication features will not work until you configure Firebase credentials');
    console.warn('   See SETUP.md for instructions on how to get Firebase credentials');
}

export default admin;