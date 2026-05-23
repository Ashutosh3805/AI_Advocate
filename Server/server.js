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

// Standard middlewares
app.use(cors({
  origin: '*', // Allows broad connection for development and testing
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
    message: 'AI Advocate Secure legal terminal backend is active and operational.',
    data: {
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
  console.log(`[SERVER] Case Terminal Node online. Listening on port ${PORT}`);
  console.log(`[STATUS] Secure channel running at http://localhost:${PORT}/api/health`);
});
