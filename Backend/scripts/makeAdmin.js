import mongoose from "mongoose";
import User from "../model/user.js";
import connectDB from "../config/db.js";
import { configDotenv } from "dotenv";

configDotenv()

const makeAdmin = async () => {

    const email = process.argv[2];

    if (!email) {
        console.error("Please provide an email address. Usage: node scripts/makeAdmin.js <email>");
        process.exit(1);
    }

    try {
        await connectDB();

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.access_level = "lead"; // 'lead' grants admin access in the current setup
        // user.role = "admin"; // Uncomment if you add a role field to the schema later

        await user.save();

        console.log(`Success! User ${user.name} (${user.email}) is now an Admin (access_level: lead).`);
        console.log("You may need to log out and log back in for changes to take effect.");

        process.exit(0);
    } catch (error) {
        console.error("Error updating user:", error);
        process.exit(1);
    }
};

makeAdmin();
