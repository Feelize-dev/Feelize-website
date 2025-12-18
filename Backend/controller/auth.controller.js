import admin from "../config/firebaseAdmin.js";
import { cookieSafetyMeasures, createSession } from "../middleware/tokenAndCookies.js";
import { sendOTP } from "../services/emailService.js";
import user from "../model/user.js";

export const createNewUser = async (req, res) => {

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    try {

        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken
        // console.log("user uid :", uid);

        let userExist = await user.findOne({ uid: decodedToken.uid }).exec()

        // If not found by UID, try by Email (merge account)
        if (!userExist && decodedToken.email) {
            userExist = await user.findOne({ email: decodedToken.email }).exec();
            if (userExist) {
                console.log(`Merging account for ${decodedToken.email}. Updating UID.`);
                userExist.uid = decodedToken.uid;
                if (decodedToken.picture) userExist.picture = decodedToken.picture;
                await userExist.save();
            }
        }

        if (userExist) {

            console.log("User with ", decodedToken.email, "has logged in again")
            const sessionCookie = await createSession(token)

            res.cookie("session", sessionCookie, cookieSafetyMeasures);
            return res.status(200).json({
                message: "User logged in",
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
        const sessionCookie = await createSession(token)
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


export const deleteSession = async (req, res) => {

    try {

        const sessionCookie = req.cookies.session;
        const decodedCookie = await admin.auth().verifySessionCookie(sessionCookie, true);
        await admin.auth().revokeRefreshTokens(decodedCookie.sub);

        console.log("usee", decodedCookie.email, "hase been logged out");

        res.clearCookie("session", cookieSafetyMeasures);

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

export const requestOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        // Normalize email
        const emailLower = email.toLowerCase();

        let existingUser = await user.findOne({ email: emailLower });

        // If user doesn't exist, we can choose to create them NOW or wait for verify.
        // But for OTP, we must store the code somewhere.
        if (!existingUser) {
            // Create shadow user
            existingUser = await user.create({
                uid: `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                email: emailLower,
                name: email.split('@')[0],
                access_level: "junior"
            });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to user with expiration (10 mins)
        existingUser.otp = otp;
        existingUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await existingUser.save();

        // Send Email
        await sendOTP(emailLower, otp);

        return res.status(200).json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        console.error("OTP Request Error:", error);
        return res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const emailLower = email.toLowerCase();

        const existingUser = await user.findOne({ email: emailLower });

        if (!existingUser || !existingUser.otp || !existingUser.otpExpires) {
            return res.status(400).json({ success: false, message: "Invalid email or OTP request not found" });
        }

        if (existingUser.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (new Date() > existingUser.otpExpires) {
            return res.status(400).json({ success: false, message: "OTP Expired" });
        }

        // Clear OTP
        existingUser.otp = undefined;
        existingUser.otpExpires = undefined;
        await existingUser.save();

        const customToken = await admin.auth().createCustomToken(existingUser.uid);

        return res.status(200).json({
            success: true,
            message: "OTP Verified",
            customToken
        });

    } catch (error) {
        console.error("OTP Verify Error:", error);
        return res.status(500).json({ success: false, message: "Failed to verify OTP", error: error.message });
    }
}