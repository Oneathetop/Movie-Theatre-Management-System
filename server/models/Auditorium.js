const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  seatId: { type: String, required: true }, 
  row: { type: String, required: true },    
  number: { type: Number, required: true }, 
  type: { type: String, default: 'Standard' } 
});

const AuditoriumSchema = new mongoose.Schema({
  roomName: { type: String, required: true, unique: true }, 
  seats: [SeatSchema]
}, { timestamps: true });

module.exports = mongoose.model('Auditorium', AuditoriumSchema);
