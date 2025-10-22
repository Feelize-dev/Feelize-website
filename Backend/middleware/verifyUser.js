import admin from "../config/firebaseAdmin.js";

export const verifyFirebaseToken = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {

        return res.status(401).json({

            message: "Unauthorized: No token provided",
            success: false,
        })
    }
    const token = authHeader.split(" ")[1];

    try {

        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log("User with email id", decodedToken.email, " is successfully verified");
        next();

    } catch (error) {

        console.error("Token verification failed:", error);

        res.status(401).json({

            message: "Token expired",
            success: false,
            data: error
        })
    }

}
