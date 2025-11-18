import admin from "../config/firebaseAdmin.js";
import { cookieSafetyMeasures, createSession } from "../middleware/tokenAndCookies.js";
import User from "../model/user.js";

export const createNewUser = async (req, res) => {

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
        const { uid, email, name, picture } = decodedToken;
        const userExist = await User.findOne({ uid: uid }).exec()

        if (userExist) {

            console.log("user", email, "Logged in successfully");
            const session = await createSession(idToken);
            res.cookie("feelize_loginSession", session, cookieSafetyMeasures);
            res.status(200).json({
                message: "Session created",
                success: true,
                data: userExist
            });
        }

        if (!userExist) {

            const newUser = await User.create({
                email: email,
                name: name,
                uid: uid,
                picture: picture
            });
            console.log("User have been successfully created", newUser.email);
            const session = await createSession(idToken);
            res.cookie("feelize_loginSession", session, cookieSafetyMeasures);
            res.status(200).json({

                success: true,
                message: "User have been successfully created",
                data: newUser
            })
        }

    } catch (error) {

        console.log(error);
        res.status(404).json({

            message: "Failed to create user",
            success: false
        })
    }
}

export const verifyUserSession = async (req, res, next) => {

    try {

        const sessionCookie = req.cookies.feelize_loginSession;

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

        const userInDb = await User.findOne({ uid: decodedCookie.uid }).exec()
        // console.log(userInDb);
        if (!userInDb) {
            return res.status(400).json({

                message: "User not found in database",
                success: false,
            })
        }
        req.user = userInDb;
        next();
        // return res.status(200).json({

        //     message: "User Successfully verified",
        //     success: true,
        //     data: userInDb
        // })

    } catch (error) {

        console.error("Session verification failed:", error.message);
        return res.status(400).json({

            message: "Failed to verify the user",
            data: error,
            success: false
        })
    }
}