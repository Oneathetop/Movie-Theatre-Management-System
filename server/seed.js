require('dotenv').config();
const mongoose = require('mongoose');

// Register and load all system schemas explicitly into our Mongoose memory matrix
require('./models/User');
require('./models/Movie');
require('./models/Auditorium');
require('./models/Showtime');
require('./models/Booking');

// Retrieve compiled models from the global registry context
const User = mongoose.model('User');
const Movie = mongoose.model('Movie');
const Auditorium = mongoose.model('Auditorium');
const Showtime = mongoose.model('Showtime');
const Booking = mongoose.model('Booking');

const seedDatabase = async () => {
  try {
    // 1. Establish the connection to our local transactional replica set cluster
    console.log("Attempting to connect to local MongoDB replica set...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected! Wiping old records...");

    // 2. CLEAR ALL RECORDS TO ENSURE A CLEAN ACID STATE RE-CREATION
    await Movie.deleteMany({});
    await Auditorium.deleteMany({});
    await Showtime.deleteMany({});
    await Booking.deleteMany({});
    await User.deleteMany({}); // 🚀 Clears out stale profile metadata cleanly
    console.log("Old records wiped clean from database tables.");

    // 3. 🚀 SEED ENTERPRISE SECURITY ACCOUNT DATA (CIA Confidentiality Layer)
    // Seed an Administrative Manager Account (Can unlock corporate revenue charts)
    const managerUser = await User.create({
      name: "Alex Manager",
      email: "manager@cinema.com",
      password: "password123", // Pre-save hooks will encrypt this securely
      role: "Manager"
    });

    // Seed a Standard Customer Account
    const customerUser = await User.create({
      name: "John Doe",
      email: "customer@cinema.com",
      password: "password123",
      role: "Customer"
    });
    console.log("Enterprise security user profiles generated successfully!");

    // 4. Seed Movie Metadata
    const movie = await Movie.create({
      title: "Inception",
      durationMinutes: 148,
      genre: "Sci-Fi",
      rating: "PG-13",
      language: "English"
    });
    console.log("Movie metadata records seeded!");

    // 5. Seed Physical Screen Maps (IMAX auditorium layout with seats A1 and A2)
    const auditorium = await Auditorium.create({
      roomName: "Screen 1 (IMAX)",
      seats: [
        { seatId: "A1", row: "A", number: 1, type: "Standard" },
        { seatId: "A2", row: "A", number: 2, type: "VIP" }
      ]
    });
    console.log("Auditorium infrastructure blueprint generated!");

    // 6. Seed Showtime Schedules (Assigning Movie to Auditorium and pre-booking A1)
    const showtime = await Showtime.create({
      movieId: movie._id,
      auditoriumId: auditorium._id,
      startTime: new Date(),
      basePrice: 15.00,
      reservedSeats: ["A1"] 
    });
    console.log("Movie timeslots successfully scheduled!");

    // 7. Seed Initial Transaction Invoice Record (Linked cleanly to John Doe)
    await Booking.create({
      customerId: customerUser._id, // Tied directly to our new seeded customer account
      showtimeId: showtime._id,
      seatsSelected: ["A1"],
      totalAmount: 15.00,
      paymentStatus: "Paid"
    });
    console.log("Initial seed booking transaction record generated!");

    console.log("🚀 Database seeding completed successfully!");
    
    // Close the connection channel cleanly so the script terminates gracefully
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error during database seeding:", error.message);
    process.exit(1);
  }
};

// Run the script
seedDatabase();
