//backend model needed for creating a post

const mongoose = require('mongoose');

//limits number of pictures
function arrayLimit(val) {
  return val.length <= 3;
}

//creates a model for a post, gets the given attributes for a post
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'The title is required'],
    trim: true
  },
  price: {
    type: String,
    required: [true, 'The price is required'],
  },
  category: {
    type: String,
    required: [true, 'The category is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'The state is required'],
    trim: true
  },
  payment: {
    type: [String], 
    required: [true, 'At least one payment option is required'],
  },
  media: {
    type: [String], 
    validate: [arrayLimit, '{PATH} exceeds the limit of 3'], 
    required: false
  },
  user:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true, 
  },
  interestedBuyers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

}, {
  timestamps: true // Add createdAt and updatedAt fields automatically
});


const Post = mongoose.model('Post', postSchema);

module.exports = Post;
