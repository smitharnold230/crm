import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { query } from './db.js';
import { runMigrations } from './migrate.js';
import { initializeSchedulers } from './utils/scheduler.js';
import { apiLimiter } from './middleware/rateLimit.js';

dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      message: 'Server is running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      message: 'Database connection failed',
      database: 'disconnected'
    });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      message: 'API is running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      message: 'Database connection failed',
      database: 'disconnected'
    });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// We need to handle this after all other routes
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    await query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    
    // Run migrations automatically
    console.log('🔄 Running database migrations...');
    await runMigrations();
    
    // Initialize automated schedulers (deadline reminders, overdue notifications)
    console.log('⏰ Initializing automated schedulers...');
    initializeSchedulers();
    console.log('✅ Schedulers started successfully');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Access the application at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();