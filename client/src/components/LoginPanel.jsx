import React, { useState } from 'react';
import axios from 'axios';

const LoginPanel = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send credentials securely to our new backend authentication checkpoint
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        // Save the encrypted JWT token and user profile details inside secure browser memory
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Pass the successful login state up to our master App application container
        onLoginSuccess(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your network or credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '320px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1a1a1a', textAlign: 'center' }}>Cinema Management</h2>
        <p style={{ margin: '0 0 24px 0', color: '#666', fontSize: '13px', textAlign: 'center' }}>Sign in to unlock live database tracking channels</p>
        
        {error && <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', fontSize: '13px', marginBottom: '16px', fontWeight: '500' }}>{error}</div>}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#444', marginBottom: '6px' }}>Email Address</label>
          <input 
            type="email" 
            placeholder="manager@cinema.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#444', marginBottom: '6px' }}>Password Identifier</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
        >
          {loading ? 'Verifying Security Hashes...' : 'Authenticate Profile'}
        </button>
        
        <div style={{ marginTop: '16px', fontSize: '11px', color: '#888', textAlign: 'center', lineHeight: '1.4' }}>
          Demo Hint:<br />
          Email: <strong>manager@cinema.com</strong> | Password: <strong>password123</strong>
        </div>
      </form>
    </div>
  );
};

export default LoginPanel;
