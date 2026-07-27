const ShowtimeCard = ({ session }) => {
  const { movieId, auditoriumId, startTime, basePrice, reservedSeats } = session;
  const totalSeats = auditoriumId?.seats?.length || 0;
  const bookedCount = reservedSeats?.length || 0;
  const openSeats = totalSeats - bookedCount;

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', width: '280px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#1a1a1a' }}>{movieId?.title}</h3>
      <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}><strong>Genre:</strong> {movieId?.genre}</p>
      <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}><strong>Screen:</strong> {auditoriumId?.roomName}</p>
      <p style={{ margin: '4px 0', fontSize: '14px', color: '#111' }}><strong>Time:</strong> {new Date(startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
      <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: 'bold', color: '#2e7d32' }}>Price: ${basePrice.toFixed(2)}</p>
      <div style={{ marginTop: '12px', borderTop: '1px dashed #eee', paddingTop: '8px', fontSize: '12px' }}>
        <span>Available Seats: <strong>{openSeats} / {totalSeats}</strong></span>
      </div>
    </div>
  );
};

export default ShowtimeCard;
