import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import ShowtimeCard from './components/ShowtimeCard';
import AnalyticsWidget from './components/AnalyticsWidget';
import SeatMap from './components/SeatMap';
import RevenueReport from './components/RevenueReport';

function App() {
  const [showtimes, setShowtimes] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSessionId, setActiveSessionId] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [showtimeRes, analyticsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/showtimes'),
        axios.get('http://localhost:5000/api/analytics/dashboard')
      ]);

      setShowtimes(showtimeRes.data.data);
      setMetrics(analyticsRes.data.metrics);
      setLoading(false);
    } catch {
      setError('Failed to pull data feeds from local backend API server.');
      setLoading(false);
    }
  }, []);

  const activeSession = useMemo(
    () => showtimes.find((session) => session._id === activeSessionId) ?? null,
    [showtimes, activeSessionId]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchDashboardData();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [fetchDashboardData]);

  if (loading) return <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>Loading Live Database Streams...</div>;
  if (error) return <div style={{ padding: '24px', color: 'red', fontFamily: 'sans-serif' }}>{error}</div>;

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <h1>Movie Theater Management System</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>Real-Time Database Dashboard Feeds (MERN Architecture)</p>

      <h2>Management Analytics</h2>
      <AnalyticsWidget metrics={metrics} />

      <h2 style={{ marginTop: '40px' }}>Now Screening Schedulers</h2>
      <p style={{ color: '#888', fontSize: '14px', marginTop: '-10px' }}>Click a card below to load the interactive seating map grid:</p>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '16px' }}>
        {showtimes.map(session => {
          const isSelectedCard = activeSession?._id === session._id;
          return (
            <div 
              key={session._id} 
              onClick={() => setActiveSessionId(session._id)}
              style={{ 
                cursor: 'pointer',
                transform: isSelectedCard ? 'scale(1.02)' : 'none',
                transition: 'transform 0.2s',
                boxShadow: isSelectedCard ? '0 0 10px rgba(25,118,210,0.5)' : 'none',
                borderRadius: '8px'
              }}
            >
              <ShowtimeCard session={session} />
            </div>
          );
        })}
      </div>

      {/* Render the interactive transactional seat grid if a card is selected */}
      {activeSession && (
        <SeatMap 
          session={activeSession} 
          onBookingComplete={fetchDashboardData} 
        />
      )}
       <RevenueReport refreshTrigger={metrics?.totalTicketsSold} />
    </div>
  );
}

export default App;
