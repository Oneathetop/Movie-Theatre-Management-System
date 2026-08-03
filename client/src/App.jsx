import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import ShowtimeCard from './components/ShowtimeCard';
import AnalyticsWidget from './components/AnalyticsWidget';
import SeatMap from './components/SeatMap';
import RevenueReport from './components/RevenueReport';
import AnalyticsCharts from './components/AnalyticsCharts';
import LoginPanel from './components/LoginPanel';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showtimes, setShowtimes] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [revenueReport, setRevenueReport] = useState([]);
  
  const [loading, setLoading] = useState(() => {
    return localStorage.getItem('user') ? true : false; // Only show loading if a user is already logged in
  });

  const [error, setError] = useState('');
  const [activeSessionId, setActiveSessionId] = useState(null);
    
  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token'); // Grab token from browser cache
      
      // 🔒 CIA Verification Rule: Format the authorization token for secure Express headers
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Pass the config headers variable into all 3 asynchronous database endpoint requests
      const [showtimeRes, analyticsRes, revenueRes] = await Promise.all([
        axios.get('http://localhost:5000/api/showtimes', config),
        axios.get('http://localhost:5000/api/analytics/dashboard', config),
        axios.get('http://localhost:5000/api/analytics/revenue-report', config)
      ]);

      setShowtimes(showtimeRes.data.data);
      setMetrics(analyticsRes.data.metrics);
      setRevenueReport(revenueRes.data?.reportData || []);
      setError('');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to pull authenticated data feeds from local backend API server.');
      setLoading(false);
    }
  }, []);

  const activeSession = useMemo(
    () => showtimes.find((session) => session._id === activeSessionId) ?? null,
    [showtimes, activeSessionId]
  );

  // Only trigger backend database streaming requests if a user is securely logged into memory
  useEffect(() => {
    if (!user) return;

    const timeoutId = setTimeout(() => {
      void fetchDashboardData();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [fetchDashboardData, user]);

  // Cleanly purge all secure session cache keys when logging out
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowtimes([]);
    setMetrics(null);
    setRevenueReport([]);
    setActiveSessionId(null);
  };

  if (loading) return <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>Authorizing Database Connection Vectors...</div>;
  
  // 🔒 CIA TRIAD INTERCEPTOR: If user is logged out, lock them out of the screen completely
  if (!user) return <LoginPanel onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      
      {/* Dynamic Profile Identity Bar & Logout Trigger Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1>Movie Theater Management System</h1>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '14px', color: '#333', marginRight: '12px' }}>Logged in as: <strong>{user.name} ({user.role})</strong></span>
          <button onClick={handleLogout} style={{ padding: '6px 12px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Log Out</button>
        </div>
      </div>
      <p style={{ color: '#666', marginTop: '0', marginBottom: '32px' }}>Secured Full-Stack Cloud Environment Cluster Dashboard Feeds</p>

      {error && <div style={{ padding: '16px', color: 'red', background: '#ffebee', borderRadius: '6px', marginBottom: '24px', fontWeight: '500' }}>{error}</div>}

      <h2>Management Analytics</h2>
      <AnalyticsWidget metrics={metrics} />

      {/* Render the analytics charts with the fetched report data and metrics */}
      <AnalyticsCharts reportData={revenueReport} metrics={metrics} />

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

      {/* 🚀 ROLE SECURITY BLOCK: Restrict access to executive ledger parameters exclusively to Manager accounts */}
      {user.role === 'Manager' ? (
         <RevenueReport refreshTrigger={metrics?.totalTicketsSold} />
      ) : (
        <div style={{ marginTop: '32px', padding: '16px', background: '#fffde7', border: '1px solid #fff59d', borderRadius: '6px', color: '#f57f17', fontSize: '14px' }}>
          ⚠️ Notice: Financial Executive Ledger components are hidden for security. Elevated 'Manager' role credentials required.
        </div>
      )}
    </div>
  );
}

export default App;
