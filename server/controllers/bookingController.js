const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

// @desc    Create a new movie booking utilizing strict ACID transaction protocols
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  // 1. Initialize an isolated multi-document ACID transactional database session tracking context
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { showtimeId, seatsSelected, totalAmount } = req.body;
    // Read the user ID straight from our secure decrypted session payload, preventing identity forging
    const customerId = req.user._id; 

    // 2. Fetch the target showtime session INSIDE the active transaction block scope
    const showtime = await Showtime.findById(showtimeId).session(session);
    if (!showtime) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Target showtime session record not found' });
    }

    // 3. ATOMICITY RULE VERIFICATION: Ensure no overlapping race condition double bookings exist
    const isAnySeatTaken = seatsSelected.some(seat => showtime.reservedSeats.includes(seat));
    if (isAnySeatTaken) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'One or more selected seats were already booked by a concurrent checkout thread!' });
    }

    // 4. Update Step A: Push the seat IDs into the showtime array context
    await Showtime.findByIdAndUpdate(
      showtimeId, 
      { $addToSet: { reservedSeats: { $each: seatsSelected } } },
      { session } // Enforces operation runs inside the transaction safety bubble
    );

    // 5. Update Step B: Generate the permanent, audit-ready financial invoice receipt document
    const booking = await Booking.create(
      [{
        customerId,
        showtimeId,
        seatsSelected,
        totalAmount,
        paymentStatus: 'Paid'
      }],
      { session }
    );

    // 🚀 THE ACID COMMIT POINT: If everything succeeds, commit both writes to the disk simultaneously
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'ACID Transaction committed safely! Booking logs permanently stored.',
      data: booking[0]
    });

  } catch (error) {
    // FAILURE ROLLBACK: If any failure or network drop triggers mid-execution, reverse all writes cleanly
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, error: error.message });
  }
};
