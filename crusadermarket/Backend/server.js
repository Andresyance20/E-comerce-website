//server file that enables you to run the server

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const userRoutes = require('./Routes/userRoutes');
const PostRoutes = require('./Routes/PostRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); 

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin@crusadermarket.db2qm2k.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api', userRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/posts', PostRoutes);
app.use('/uploads', express.static('uploads'));


// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
module.exports = app; // Export the app for Supertest
