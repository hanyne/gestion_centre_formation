const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('../model/User');
const { authAdmin } = require('../middleware/auth');

// Configuration de multer pour le téléversement des photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'user-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images JPEG, JPG et PNG sont autorisées'));
    }
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    user = new User({
      email,
      password,
      role: role || 'apprenant'
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    console.log('JWT_SECRET in register:', process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, role: user.role });
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
    res.status(500).json({ message: err.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    console.log('JWT_SECRET in login:', process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    res.status(500).json({ message: err.message });
  }
});

// CRUD Routes for Users (Admin Only)

// Get all users (formateurs and apprenants)
router.get('/users', authAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['formateur', 'apprenant'] } }).select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a single user by ID
router.get('/users/:id', authAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    if (!['formateur', 'apprenant'].includes(user.role)) {
      return res.status(403).json({ message: 'Utilisateur n\'est ni formateur ni apprenant' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new user (formateur or apprenant)
router.post('/users', authAdmin, upload.single('photo'), async (req, res) => {
  const { email, password, role, firstName, lastName, dateOfBirth, bio } = req.body;
  const photo = req.file ? req.file.filename : undefined;

  try {
    if (!['formateur', 'apprenant'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide. Doit être formateur ou apprenant.' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    if (!photo) {
      return res.status(400).json({ message: 'Une photo est requise pour créer un utilisateur.' });
    }

    user = new User({
      email,
      password,
      role,
      firstName,
      lastName,
      dateOfBirth,
      photo,
      bio
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ 
      message: 'Utilisateur créé avec succès', 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        dateOfBirth: user.dateOfBirth, 
        photo: user.photo, 
        bio: user.bio 
      } 
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update a user
router.put('/users/:id', authAdmin, upload.single('photo'), async (req, res) => {
  const { email, password, role, firstName, lastName, dateOfBirth, bio } = req.body;
  const photo = req.file ? req.file.filename : undefined;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (role && !['formateur', 'apprenant'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide. Doit être formateur ou apprenant.' });
    }

    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (role) user.role = role;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (photo) user.photo = photo;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({ 
      message: 'Utilisateur mis à jour avec succès', 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        dateOfBirth: user.dateOfBirth, 
        photo: user.photo, 
        bio: user.bio 
      } 
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete a user
router.delete('/users/:id', authAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (!['formateur', 'apprenant'].includes(user.role)) {
      return res.status(403).json({ message: 'Utilisateur n\'est ni formateur ni apprenant' });
    }

    await user.deleteOne(); // Use deleteOne() instead of deprecated remove()
    console.log(`User with ID ${req.params.id} deleted successfully`);
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;