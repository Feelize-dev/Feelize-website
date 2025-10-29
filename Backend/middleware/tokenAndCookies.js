import admin from "../config/firebaseAdmin.js";

export const cookieSafetyMeasures = {

    httpOnly: true,
    secure: process.env.ENVIRONMENT === "Development" ? false : true, // ture for production(HTTPS)
    maxAge: 14 * 24 * 60 * 60 * 1000, //14 days as firebase max session expiry
    sameSite: process.env.ENVIRONMENT === "Development" ? 'lax' : 'none', //none required for cross-origin (e.g., 5173 and 5000)
    path: "/",
}

export const createSession = async (token) => {

    // console.log(token);

    const expiresIn = 14 * 24 * 60 * 60 * 1000;

    const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn });
    return sessionCookie
}