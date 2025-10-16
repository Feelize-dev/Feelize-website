import admin from "../config/firebaseAdmin.js";
import user from "../model/user.js";

export const createNewUser = async (req, res) => {

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    try {

        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken

        const userExist = await user.findOne({ uid })

        if (userExist) {

            console.log(decodedToken.email, " user relogin")
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

        return res.status(200).json({

            success:true,
            message:"New user is registered in Database",
            data:newUser
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