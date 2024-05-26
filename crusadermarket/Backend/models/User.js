//backend model for creating an account and logging into an account

// user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define a schema for both signup and login
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String },
});

// Hash password before saving to the database
userSchema.pre('save', async function(next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Method to validate password
userSchema.methods.isValidPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
