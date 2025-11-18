import admin from "../config/firebaseAdmin.js";
import { cookieSafetyMeasures } from "../middleware/tokenAndCookies.js";

export const verifyFirebaseTokenId = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {

        return res.status(401).json({
            message: "No token provided",
            success: false
        });
    }
    const idToken = authHeader.split("Bearer ")[1];

    try {

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        if (!decodedToken) {

            res.status(404).json({

                message: "Failed to decode Firebase TokenId",
                success: flase
            })
        }
        console.log("User", decodedToken.email, "has been successfully verified");
        next()
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).json({
            data: error,
            message: "Invalid or expired token",
            success: false
        });
    }
}

export const deleteSession = async (req, res) => {

    // console.log(req.cookies.feelize_loginSession);
    
    try {

        const sessionCookie = req.cookies.feelize_loginSession;
        const decodedCookie = await admin.auth().verifySessionCookie(sessionCookie, true);
        await admin.auth().revokeRefreshTokens(decodedCookie.sub);

        console.log("usee", decodedCookie.email, "hase been logged out");

        res.clearCookie("feelize_loginSession", cookieSafetyMeasures);

        return res.status(200).json({
            message: "User logged out successfully — session revoked",
            success: true,
        });


    } catch (error) {

        console.error("Logout failed:", error);
        return res.status(400).json({
            message: "Failed to log out user",
            data: error,
            success: false,
        });
    }
}