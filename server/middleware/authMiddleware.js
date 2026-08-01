const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes against unauthenticated users
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from format: "Bearer eyJhbGciOi..."
      token = req.headers.authorization.split(' ')[1];

      // Decrypt and verify the integrity of the JWT session payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123');

      // Attach the verified user profile information onto the Express request object
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token identifier' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no session token found' });
  }
};

// Middleware to restrict access based on clear enterprise corporate security roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Security clearance required. Role [${req.user?.role || 'Guest'}] is unauthorized.` 
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
