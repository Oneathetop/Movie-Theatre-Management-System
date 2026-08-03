const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate a secure, tamper-proof session token signature
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_123', {
    expiresIn: '30d' // Token remains valid for 30 days
  });
};

// @desc    Register a new enterprise user account
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user email registry record already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User account already exists with that email' });
    }

    // Save the profile (the pre-save model hook will automatically hash the password)
    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Authenticate credentials and issue a login session key
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Lookup user by email identifier
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid login email credentials' });
    }

    // Use our model method to check if the hashed password maps correctly
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
