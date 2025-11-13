import { configDotenv } from 'dotenv';
import admin from '../config/firebaseAdmin.js';

configDotenv()

export const cookieSafetyMeasures = {

    httpOnly: true,
    secure: process.env.ENVIRONMENT === "Development" ? false : true,
    maxAge: 14 * 24 * 60 * 60 * 1000,
    sameSite: process.env.ENVIRONMENT === "Development" ? 'Lax' : 'None'
}

export const createSession = async (idToken) => {

    const expiresIn = 14 * 24 * 60 * 60 * 1000;
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    return sessionCookie;
}