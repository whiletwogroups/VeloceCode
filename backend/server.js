const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

app.get('/', (req, res) => {
  res.json({ message: '180-Day Roadmap Tracker API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roadmap-tracker';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connection established successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('\n================================================================');
    console.error('DATABASE CONNECTION ERROR: Failed to connect to MongoDB.');
    console.error('Please verify that:');
    console.error('1. MongoDB is installed on your local machine.');
    console.error('2. The MongoDB Service is running (run: net start MongoDB).');
    console.error('3. The connection URI in your backend/.env file is correct.');
    console.error('================================================================\n');
    console.error(error);
    
    // Fallback: Start server anyway so frontend can connect and display error message
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in (DATABASE DISCONNECTED MODE)`);
    });
  });
