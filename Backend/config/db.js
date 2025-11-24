
import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv()

const connectDB = async () => {
  try {
    // Read connection string from env var. Note: environment variable name uses "STRING" suffix.
    if (!process.env.MONGO_DB_CONNECTION_STRING) {
      console.error("❌ MONGO_DB_CONNECTION_STRING not found in environment variables");
      console.error("   Please set it in the .env file");
      process.exit(1);
    }

    await mongoose.connect(`${process.env.MONGO_DB_CONNECTION_STRING}`);
    console.log("✅ Database Connected successfully");

  } catch (error) {
    console.error("❌ Database connection Error:", error.message);
    console.error("   Please check your MongoDB connection string in the .env file");
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectDB;
