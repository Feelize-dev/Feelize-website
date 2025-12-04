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

export const verifySession = async (req, res, next) => {

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

        req.user = userInDb;
        next()

    } catch (error) {

        console.error("Session verification failed:", error.message);
        return res.status(400).json({

            message: "Failed to verify the user",
            data: error,
            success: false
        })
    }
}

// Middleware variant: verifies session cookie and attaches decodedCookie and userInDb to req
export const verifySessionMiddleware = async (req, res, next) => {
    try {
        const sessionCookie = req.cookies.session;
        if (!sessionCookie) {
            console.log("failed to find session");
            return res.status(401).json({
                message: "No session cookie found — user not authenticated",
                success: false,
            });
        }

        const decodedCookie = await admin.auth().verifySessionCookie(sessionCookie, true);
        if (!decodedCookie) {
            return res.status(401).json({
                message: "Invalid session cookie — user not authenticated",
                success: false,
            });
        }

        const userInDb = await user.findOne({ uid: decodedCookie.uid }).exec();
        if (!userInDb) {
            return res.status(401).json({
                message: "User not found in database",
                success: false,
            });
        }

        // Attach useful data for downstream handlers
        req.decodedCookie = decodedCookie;
        req.user = userInDb;
        return next();
    } catch (error) {
        console.error("Session verification middleware failed:", error?.message || error);
        return res.status(401).json({
            message: "Failed to verify session",
            data: error,
            success: false,
        });
    }
}