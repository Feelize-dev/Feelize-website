import admin from "../config/firebaseAdmin.js";

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

export const revokeSession = (req, res) => {


}