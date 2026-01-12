import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv()

const connectDB = async () => {
  try {

  // Read connection string from env var. Note: environment variable name uses "STRING" suffix.
  await mongoose.connect(`${process.env.MONGO_DB_CONNECTION_STRING}`);
    console.log("Database Connected successfully");

  } catch (error) {

    console.log("Database connected Error", error);
    process.exit(1); // Exit the process if the connection fails

  }
};

export default connectDB;
