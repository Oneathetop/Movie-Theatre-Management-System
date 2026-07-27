require('dotenv').config();
const mongoose = require('mongoose');

// Import data schemas
const Movie = require('./models/Movie');
const Auditorium = require('./models/Auditorium');
const Showtime = require('./models/Showtime');
const Booking = require('./models/Booking'); // Import the Booking model

const seedDatabase = async () => {
  try {
    // 1. Establish the connection
    console.log("Attempting to connect to local MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected! Starting data insertion...");

    // 2. Clear old data to avoid duplicates
    await Booking.deleteMany({}); // Clear the Bookings collection first
    await Movie.deleteMany({});
    await Auditorium.deleteMany({});
    await Showtime.deleteMany({});

    // 3. Create a test movie
    const movie = await Movie.create({
      title: "Inception",
      durationMinutes: 148,
      genre: "Sci-Fi",
      rating: "PG-13",
      language: "English"
    });
    console.log("Movie inserted!");

    // 4. Create a test auditorium with a small seat map grid (A1, A2)
    const auditorium = await Auditorium.create({
      roomName: "Screen 1 (IMAX)",
      seats: [
        { seatId: "A1", row: "A", number: 1, type: "Standard" },
        { seatId: "A2", row: "A", number: 2, type: "VIP" }
      ]
    });
    console.log("Auditorium inserted!");

    // 5. Create a test showtime linking them together
    await Showtime.create({
      movieId: movie._id,
      auditoriumId: auditorium._id,
      startTime: new Date(),
      basePrice: 15.00,
      reservedSeats: ["A1"] // Pre-book one seat for testing purposes
    });
    const showtime = await Showtime.findOne({ movieId: movie._id, auditoriumId: auditorium._id });
    console.log("Showtime inserted!");

    // 🚀 NEW LOGIC: Insert an matching initial transaction log into your Bookings table
    await Booking.create({
      customerId: "customer_initial_seed",
      showtimeId: showtime._id,
      seatsSelected: ["A1"],
      totalAmount: 15.00,
      paymentStatus: "Paid"
    });
    console.log("Initial seed booking transaction record generated!");

    console.log("🚀 Database seeding completed successfully!");
    
    // Close the connection so the script finishes execution gracefully
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error during database seeding:", error.message);
    process.exit(1);
  }
};

// Run the function
seedDatabase();
