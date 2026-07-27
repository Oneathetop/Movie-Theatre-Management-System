const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customerId: { type: String, required: true }, 
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  seatsSelected: { type: [String], required: true }, 
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Paid' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
