const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  genre: { type: String, required: true },
  rating: { type: String, required: true },
  language: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
