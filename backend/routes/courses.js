// routes/courses.js
const express = require('express');
const router = express.Router();
const Course = require('../model/Course');
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth'); // Correct import with destructuring

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Erreur : Seules les images (jpeg, jpg, png) sont autorisées !');
    }
  },
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new course (admin only)
router.post('/', auth(['admin']), upload.single('image'), async (req, res) => {
  try {
    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      instructor: req.body.instructor,
      duration: req.body.duration,
      price: req.body.price,
      image: req.file ? req.file.filename : null,
    });

    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a course (admin only)
router.put('/:id', auth(['admin']), upload.single('image'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    course.instructor = req.body.instructor || course.instructor;
    course.duration = req.body.duration || course.duration;
    course.price = req.body.price || course.price;
    if (req.file) {
      course.image = req.file.filename;
    }

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a course (admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    await course.remove();
    res.json({ message: 'Formation supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;