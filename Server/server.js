import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import analyzeRoutes from './routes/analyzeRoutes.js';

// Load environmental variables
dotenv.config();

// Establish core database session
connectDB();

const app = express();

// Trust proxy when deployed behind reverse proxies (Render, Railway, etc.)
app.set('trust proxy', 1);

// CORS configuration — restrict to frontend URL in production
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded legal document resources statically
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Main Route Declarations
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', uploadRoutes); // Mounts POST /api/upload and GET /api/documents
app.use('/api/analyze', analyzeRoutes);

// Root Welcome Healthcheck Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Advocate backend is active and operational.',
    data: {
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      time: new Date()
    }
  });
});

// Centralized error handling filter
app.use(errorHandler);

// Launch configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const env = process.env.NODE_ENV || 'development';
  console.log(`[SERVER] AI Advocate online (${env}) — port ${PORT}`);
  console.log(`[HEALTH] http://localhost:${PORT}/api/health`);
});

