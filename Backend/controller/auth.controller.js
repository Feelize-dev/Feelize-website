import admin from "../config/firebaseAdmin.js";
import { cookieSafetyMeasures, createSession } from "../middleware/tokenAndCookies.js";
import user from "../model/user.js";

export const createNewUser = async (req, res) => {

    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")[1];
    
    try {

        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken
        // console.log("user uid :", uid);

        const userExist = await user.findOne({ uid: decodedToken.uid }).exec()

        if (userExist) {

            console.log("User with ", decodedToken.email, "has logged in again")
            const sessionCookie = await createSession(token)
            console.log(sessionCookie);
            
            res.cookie("session", sessionCookie, cookieSafetyMeasures);
            return res.status(200).json({
                message: "User already exists",
                user: userExist,
            });
        }

        const newUser = await user.create({

            uid,
            email,
            name,
            picture
        })

        // create a new session using firebase createSessionCookie
        const sessionCookie = createSession(token)
        res.cookie("session", sessionCookie, cookieSafetyMeasures);
        return res.status(200).json({

            success: true,
            message: "New user is registered in Database",
            data: newUser
        })

    } catch (error) {

        console.error("Token verification failed:", error);

        res.status(401).json({

            message: "",
            success: false,
            data: error
        })
    }
}
