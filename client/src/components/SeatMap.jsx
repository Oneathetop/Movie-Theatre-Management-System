import { useState } from 'react';
import axios from 'axios';

const SeatMap = ({ session, onBookingComplete }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const { _id: showtimeId, basePrice, reservedSeats, auditoriumId } = session;
  const seatGrid = auditoriumId?.seats || [];

  // Toggle selection state when a user clicks an available seat
  const handleSeatClick = (seatId) => {
    if (reservedSeats.includes(seatId)) return; // Seat is locked, do nothing

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId)); // Deselect
    } else {
      setSelectedSeats([...selectedSeats, seatId]); // Select
    }
  };

  const handleCheckout = async () => {
    if (selectedSeats.length === 0) return;
    setIsSubmitting(true);
    setMessage('');

    try {
      // Execute a formal database payload purchase transaction
      const response = await axios.post('http://localhost:5000/api/bookings', {
        customerId: "customer_guest_01", // Placeholder guest profile
        showtimeId: showtimeId,
        seatsSelected: selectedSeats,
        totalAmount: selectedSeats.length * basePrice
      });

      if (response.data.success) {
        setMessage('🎟️ Booking Confirmed! Database records modified.');
        setSelectedSeats([]);
        // Trigger a fresh asynchronous database reload on the parent container
        onBookingComplete();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Transaction processing failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '24px' }}>
      <h3 style={{ margin: '0 0 4px 0' }}>Select Your Seats</h3>
      <p style={{ color: '#666', fontSize: '13px', margin: '0 0 16px 0' }}>Screen Stage is located at the top</p>
      
      {/* The Visual Stage Layout Anchor */}
      <div style={{ height: '6px', background: '#333', borderRadius: '4px', marginBottom: '24px', textAlign: 'center', fontSize: '10px', color: '#fff', lineHeight: '6px' }} />

      {/* CSS Grid layout mapping coordinates straight from MongoDB */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
        {seatGrid.map((seat) => {
          const isBooked = reservedSeats.includes(seat.seatId);
          const isSelected = selectedSeats.includes(seat.seatId);

          let bg = '#e0e0e0'; // Available standard color
          let textColor = '#333';
          let cursorType = 'pointer';

          if (isBooked) {
            bg = '#d32f2f'; // Locked/Reserved color (Red)
            textColor = '#fff';
            cursorType = 'not-allowed';
          } else if (isSelected) {
            bg = '#2e7d32'; // Active user selection choice (Green)
            textColor = '#fff';
          }

          return (
            <div
              key={seat._id}
              onClick={() => handleSeatClick(seat.seatId)}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: bg,
                color: textColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                borderRadius: '6px',
                cursor: cursorType,
                userSelect: 'none',
                fontSize: '14px'
              }}
            >
              {seat.seatId}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '16px' }}>
        <div>
          <span style={{ fontSize: '14px' }}>Selected: <strong>{selectedSeats.join(', ') || 'None'}</strong></span>
          <br />
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Total Cost: ${(selectedSeats.length * basePrice).toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={selectedSeats.length === 0 || isSubmitting}
          style={{
            padding: '10px 20px',
            backgroundColor: selectedSeats.length === 0 ? '#cccccc' : '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Ticket Purchase'}
        </button>
      </div>
      {message && <p style={{ marginTop: '12px', fontWeight: 'bold', color: '#1976d2' }}>{message}</p>}
    </div>
  );
};

export default SeatMap;
