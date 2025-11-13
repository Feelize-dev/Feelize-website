import { configDotenv } from 'dotenv';
import express from "express"
import cors from "cors"
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';

const app = express();
configDotenv()

// Middleware
app.use(cors({
  origin: process.env.DEVELOPMENT_CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());

// Increased payload limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB
connectDB();

// Routes
import userRoutes from './routes/userRoutes.js';
// const contactRoutes = require('./routes/contactRoutes');
// const aiRoutes = require('./routes/aiRoutes');

app.use('/api/users', userRoutes);
// app.use('/api', contactRoutes);
// app.use('/api', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🌐 CORS enabled for ${process.env.DEVELOPMENT_CLIENT_URL || 'http://localhost:5173'}`);
});
