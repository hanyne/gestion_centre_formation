// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId, // Référence à un utilisateur
    ref: 'User', // Modèle User
    required: true
  },
  image: {
    type: String,
    required: false
  },
  rating: {
    type: Number,
    default: 0
  },
  duration: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);