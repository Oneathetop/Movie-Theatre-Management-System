const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv')
const cors = require('cors');

// Register all Mongoose models in memory immediately on boot
require('./models/User');
require('./models/Movie');
require('./models/Auditorium');
require('./models/Showtime');
require('./models/Booking');

//Import Custom Route Modules
const showtimeRoutes = require('./routes/showtimeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to the local database instance
connectDB();

const app = express();

// Middleware to parse incoming JSON payloads 
app.use(express.json());
app.use(cors());

// Mount API Routes to Paths
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);

// Base test route to verify that the server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Application is running on port ${PORT}`);
});