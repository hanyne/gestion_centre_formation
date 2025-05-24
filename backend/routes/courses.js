const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Course = require('../model/Course');
const { auth, authAdmin } = require('../middleware/auth');

// Configuration de multer pour le téléversement des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'course-' + uniqueSuffix + path.extname(file.originalName));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalName).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images JPEG, JPG et PNG sont autorisées'));
    }
  }
});

// Get all courses (accessible to all authenticated users)
router.get('/', auth(['admin', 'formateur', 'apprenant']), async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'firstName lastName email');
    res.json(courses);
  } catch (err) {
    console.error('Erreur lors de la récupération des cours:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Get courses for the logged-in instructor
router.get('/instructor', auth(['formateur']), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id }).populate('instructor', 'firstName lastName email');
    res.json(courses);
  } catch (err) {
    console.error('Erreur lors de la récupération des formations du formateur:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Get a single course by ID (public access)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de cours invalide' });
    }
    const course = await Course.findById(req.params.id).populate('instructor', 'firstName lastName email bio');
    if (!course) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }
    res.json(course);
  } catch (err) {
    console.error('Erreur lors de la récupération du cours:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Create a course (Admin only)
router.post('/', authAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, instructor, duration, price, rating } = req.body;
    if (!mongoose.Types.ObjectId.isValid(instructor)) {
      return res.status(400).json({ message: 'ID du formateur invalide' });
    }
    const image = req.file ? req.file.filename : undefined;

    const course = new Course({
      title,
      description,
      instructor,
      duration,
      price,
      rating: rating || 0,
      image
    });

    await course.save();
    const populatedCourse = await Course.findById(course._id).populate('instructor', 'firstName lastName email');
    res.status(201).json(populatedCourse);
  } catch (err) {
    console.error('Erreur lors de la création du cours:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Update a course (Admin only)
router.put('/:id', authAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de cours invalide' });
    }
    const { title, description, instructor, duration, price, rating, schedule, imagePath } = req.body;
    if (instructor && !mongoose.Types.ObjectId.isValid(instructor)) {
      return res.status(400).json({ message: 'ID du formateur invalide' });
    }
    const image = req.file ? req.file.filename : imagePath;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.instructor = instructor || course.instructor;
    course.duration = duration || course.duration;
    course.price = price || course.price;
    course.rating = rating || course.rating;
    course.image = image || course.image;
    if (schedule) {
      course.schedule = JSON.parse(schedule);
    }

    await course.save();
    const populatedCourse = await Course.findById(course._id).populate('instructor', 'firstName lastName email');
    res.json(populatedCourse);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du cours:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Delete a course (Admin only)
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de cours invalide' });
    }
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }
    await Course.deleteOne({ _id: req.params.id });
    res.json({ message: 'Formation supprimée avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du cours:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;