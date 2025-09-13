import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { errorHandler, notFound } from "./src/middlewares/errorHandler.js";
import { 
  securityHeaders, 
  sanitizeInput, 
  requestLogger 
} from "./src/middlewares/auth.js";
import routes from "./src/route/index.js";
import { connectDB } from "./src/config/db.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// Security middleware
app.use(helmet());
app.use(securityHeaders);
app.use(sanitizeInput);

// CORS configuration
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Prince Music App API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use(routes);

// Handle 404 for undefined routes
app.use(notFound);

// Global error handler (must be last middleware)
app.use(errorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Connect to MongoDB
  await connectDB();
});
