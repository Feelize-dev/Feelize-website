// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";

dotenv.config(); // Load .env variables

const app = express();

// Connect to MongoDB
connectDB();

// Middleware - CORS Configuration
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigin = process.env.ENVIRONMENT === "Production"
      ? process.env.PRODUCTION_CLIENT_URL
      : process.env.DEVELOPMENT_CLIENT_URL || "http://localhost:5174";

    if (origin === allowedOrigin) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS: Blocked request from origin: ${origin}`);
      console.warn(`   Expected origin: ${allowedOrigin}`);
      console.warn(`   Environment: ${process.env.ENVIRONMENT || 'Development (default)'}`);
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON body
app.use(cookieParser())

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

import engineerRoutes from "./routes/engineerRoutes.js";
import affiliateRoutes from "./routes/affiliateRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import integrationRoutes from "./routes/integrationRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

// ... existing code ...

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/engineers", engineerRoutes);
app.use("/api/affiliates", affiliateRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activity-logs", activityRoutes);
app.use("/api", integrationRoutes); // Mounts at /api/llm, /api/email, etc.

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.ENVIRONMENT || 'Development (default)'}`);
  const allowedOrigin = process.env.ENVIRONMENT === "Production"
    ? process.env.PRODUCTION_CLIENT_URL
    : process.env.DEVELOPMENT_CLIENT_URL || "http://localhost:5174";
  console.log(`🌐 CORS allowed origin: ${allowedOrigin}`);
  
  // Check for Firebase configuration
  if (!process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID === 'your-firebase-project-id') {
    console.warn('⚠️  WARNING: Firebase credentials not configured in .env file');
    console.warn('   Please update FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY');
  }
  
  // Check for MongoDB configuration
  if (!process.env.MONGO_DB_CONNECTION_STRING || process.env.MONGO_DB_CONNECTION_STRING === 'mongodb://localhost:27017/feelize') {
    console.warn('⚠️  WARNING: Using default MongoDB connection string');
  }
});
