const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');

// ==========================================
// 1. DASHBOARD ANALYTICS (Basic Statistics)
// ==========================================
// @desc    Calculate Movie Theater Operational Analytics
// @route   GET /api/analytics/dashboard
exports.getTheaterAnalytics = async (req, res) => {
  try {
    const showtimes = await Showtime.find().populate('auditoriumId', 'seats');

    let totalPossibleSeats = 0;
    let totalBookedSeats = 0;

    showtimes.forEach(session => {
      if (session.auditoriumId && session.auditoriumId.seats) {
        totalPossibleSeats += session.auditoriumId.seats.length;
        totalBookedSeats += session.reservedSeats.length;
      }
    });

    const utilizationRate = totalPossibleSeats > 0 
      ? ((totalBookedSeats / totalPossibleSeats) * 100).toFixed(2) 
      : 0;

    res.status(200).json({
      success: true,
      metrics: {
        totalActiveShowtimes: showtimes.length,
        totalSeatsAvailableAcrossTheater: totalPossibleSeats,
        totalTicketsSold: totalBookedSeats,
        capacityUtilizationRate: `${utilizationRate}%`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 2. EXECUTIVE REVENUE LEDGER (Aggregations)
// ==========================================
// @desc    Generate deep revenue analytics grouped by movie titles
// @route   GET /api/analytics/revenue-report
exports.getRevenueReport = async (req, res) => {
  try {
    const report = await Booking.aggregate([
      {
        $lookup: {
          from: 'showtimes',
          localField: 'showtimeId',
          foreignField: '_id',
          as: 'showtimeDetails'
        }
      },
      { $unwind: { path: '$showtimeDetails', preserveNullAndEmptyArrays: true } },
      
      {
        $lookup: {
          from: 'movies',
          localField: 'showtimeDetails.movieId',
          foreignField: '_id',
          as: 'movieDetails'
        }
      },
      { $unwind: { path: '$movieDetails', preserveNullAndEmptyArrays: true } },

      {
        $group: {
          _id: { $ifNull: ['$movieDetails.title', 'Uncategorized/Deleted Movies'] },
          totalRevenueGenerated: { $sum: '$totalAmount' },
          totalTransactionsCount: { $sum: 1 },
          seatsReservedTotal: { $sum: { $cond: [{ $isArray: '$seatsSelected' }, { $size: '$seatsSelected' }, 0] } }
        }
      },
      { $sort: { totalRevenueGenerated: -1 } }
    ]);

    res.status(200).json({
      success: true,
      reportData: report
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
