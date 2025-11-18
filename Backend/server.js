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

// Middleware
if (process.env.ENVIRONMENT === "Development") {

  app.use(cors({
    credentials: true,
    origin: process.env.DEVELOPMENT_CLIENT_URL
  }))
} else if (process.env.ENVIRONMENT === "Production") {

  app.use(cors({
    credentials: true,
    origin: process.env.PRODUCTION_CLIENT_URL
  }))
}
app.use(express.json()); // Parse JSON body
app.use(cookieParser())

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/user", userRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
