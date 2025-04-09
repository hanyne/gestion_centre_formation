// model/Enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  nom: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  prenom: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Veuillez entrer un email valide']
  },
  telephone: {
    type: String,
    trim: true,
    match: [/^[0-9]{8}$/, 'Le numéro de téléphone doit contenir 8 chiffres']
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);