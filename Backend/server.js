import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

// Route Imports
import userRoutes from "./routes/userRoutes.js";
import engineerRoutes from "./routes/engineerRoutes.js";
import affiliateRoutes from "./routes/affiliateRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import integrationRoutes from "./routes/integrationRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";

dotenv.config(); // Load .env variables

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow any localhost origin in development
    if (process.env.ENVIRONMENT === "Development" && origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }

    const allowedOrigins = [
      process.env.DEVELOPMENT_CLIENT_URL,
      process.env.PRODUCTION_CLIENT_URL
    ].filter(Boolean);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json()); // Parse JSON body
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Mount Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/engineers", engineerRoutes);
app.use("/api/affiliates", affiliateRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activity-logs", activityRoutes);
app.use("/api", integrationRoutes); // Mounts at /api/llm, /api/email, etc.
app.use("/api/admin", adminRoutes); // Admin Panel Routes
app.use("/api/meetings", meetingRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
