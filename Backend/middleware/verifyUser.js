import admin from "../config/firebaseAdmin.js";
import user from "../model/user.js";

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

export const verifySession = async (req, res) => {

    try {
        const sessionCookie = req.cookies.session;
        if (!sessionCookie) {

            console.log("failed to find session");
            return res.status(400).json({

                message: "No session cookie found — user not authenticated",
                success: false,
            })
        }
        const decodedCookie = await admin.auth().verifySessionCookie(sessionCookie, true);
        // console.log(decodedCookie);
        if (!decodedCookie) {
            return res.status(400).json({

                message: "No session cookie found — user not authenticated",
                success: false,
            })
        }

        const userInDb = await user.findOne({ uid: decodedCookie.uid }).exec()
        // console.log(userInDb);
        if (!userInDb) {
            return res.status(400).json({

                message: "User not found in database",
                success: false,
            })
        }

        return res.status(200).json({

            message: "User Successfully verified",
            success: true,
            data: decodedCookie
        })

    } catch (error) {

        console.error("Session verification failed:", error.message);
        return res.status(400).json({

            message: "Failed to verify the user",
            data: error,
            success: false
        })
    }
}