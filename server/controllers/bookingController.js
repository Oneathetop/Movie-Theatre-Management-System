const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

// @desc    Create a new movie booking transaction
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { customerId, showtimeId, seatsSelected, totalAmount } = req.body;

    // 1. Fetch the target showtime session
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime session not found' });
    }

    // 2. Check if any requested seats are already reserved
    const isAnySeatTaken = seatsSelected.some(seat => showtime.reservedSeats.includes(seat));
    if (isAnySeatTaken) {
      return res.status(400).json({ success: false, message: 'One or more selected seats are already booked!' });
    }

    // 3. Atomically push the new seats into the showtime's reservedSeats array
    await Showtime.findByIdAndUpdate(showtimeId, {
      $addToSet: { reservedSeats: { $each: seatsSelected } }
    });

    // 4. Create the formal sales receipt in the bookings collection
    const booking = await Booking.create({
      customerId,
      showtimeId,
      seatsSelected,
      totalAmount
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
