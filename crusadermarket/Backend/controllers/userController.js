//backend controller needed for signing up and logging in as a user

// authController.js
const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'bfew78p48rn20rr';  // Use environment variables in production

//prompts user to enter the attributes needed to signup
exports.signup = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const user = await User.create({ name, email, password, phone });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error signing up' });
  }
};

//method for logging into the site by giving your credentials
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    // Check password
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Incorrect password' });
    }
    // User authenticated, generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ success: true, data: user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error logging in' });
  }
};

// Get user name
exports.getUserName = async (req, res) => {
  try {
      const user = await User.findById(req.user.userId).select('name');
      res.status(200).json({ success: true, name: user.name });
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Error retrieving user name' });
  }
};



// Get user phone number
exports.getUserPhone = async (req, res) => {
  try {
      const user = await User.findById(req.user.userId).select('phone');
      res.json({ success: true, phone: user.phone });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error retrieving user phone number' });
  }
};


// Get user email
exports.getUserEmail = async (req, res) => {
  try {
      const user = await User.findById(req.user.userId).select('email');
      res.json({ success: true, email: user.email });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error retrieving user email' });
  }
};

// Update user name
exports.updateUserName = async (req, res) => {
  const { newName } = req.body;
  try {
      const updatedUser = await User.findByIdAndUpdate(req.user.userId, { name: newName }, { new: true }).select('name');
      res.status(200).json({ success: true, name: updatedUser.name });
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Error updating user name' });
  }
};

// Update user email
exports.updateUserEmail = async (req, res) => {
  const { newEmail } = req.body;
  try {
      const updatedUser = await User.findByIdAndUpdate(req.user.userId, { email: newEmail }, { new: true, select: 'email' });
      res.json({ success: true, email: updatedUser.email });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error updating user email' });
  }
};

// Update user phone number
exports.updateUserPhone = async (req, res) => {
  const { newPhone } = req.body;
  try {
      const updatedUser = await User.findByIdAndUpdate(req.user.userId, { phone: newPhone }, { new: true, select: 'phone' });
      res.json({ success: true, phone: updatedUser.phone });

  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error updating user phone number' });
  }
};
