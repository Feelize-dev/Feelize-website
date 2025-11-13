import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv()

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_DB_CONNECTION_STRING;

    if (!mongoURI) {
      console.error('❌ MongoDB connection string not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;