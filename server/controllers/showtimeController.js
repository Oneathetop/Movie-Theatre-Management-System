const Showtime = require('../models/Showtime');

// @desc    Get all available showtimes with full movie and screen details
// @route   GET /api/showtimes
exports.getShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find()
      .populate('movieId', 'title durationMinutes genre rating') // Fetch specific movie details
      .populate('auditoriumId', 'roomName seats'); // Fetch screen name and full structural seat map

    res.status(200).json({
      success: true,
      count: showtimes.length,
      data: showtimes
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
