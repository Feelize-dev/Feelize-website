
// SDKs and firebase services
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_SERVER_API_KEY,
    authDomain: import.meta.env.VITE_SERVER_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_SERVER_PROJECT_ID,
    storageBucket: import.meta.env.VITE_SERVER_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_SERVER_MESSAGING_CENTER_ID,
    appId: import.meta.env.VITE_SERVER_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({
    prompt: "select_account"
});

export const auth = getAuth();

// popup screen
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);