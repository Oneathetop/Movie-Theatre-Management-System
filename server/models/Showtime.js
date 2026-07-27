const mongoose = require('mongoose');

const ShowtimeSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  auditoriumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auditorium', required: true },
  startTime: { type: Date, required: true },
  basePrice: { type: Number, required: true },
  reservedSeats: { type: [String], default: [] } 
}, { timestamps: true });

module.exports = mongoose.model('Showtime', ShowtimeSchema);
