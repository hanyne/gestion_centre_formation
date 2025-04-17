// routes/courses.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Course = require('../model/Course');
const { authAdmin } = require('../middleware/auth');

// Configuration de multer pour le téléversement des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'course-' + uniqueSuffix + path.extname(file.originalname));
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

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'firstName lastName email'); // Peupler le champ instructor
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// routes/courses.js
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'firstName lastName email bio');
    if (!course) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a course (Admin only)
router.post('/', authAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, instructor, duration, price, rating } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const course = new Course({
      title,
      description,
      instructor, // Instructor est maintenant un ObjectId
      duration,
      price,
      rating: rating || 0,
      image
    });

    await course.save();
    const populatedCourse = await Course.findById(course._id).populate('instructor', 'firstName lastName email');
    res.status(201).json(populatedCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a course (Admin only)
router.put('/:id', authAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, instructor, duration, price, rating, imagePath } = req.body;
    const image = req.file ? req.file.filename : imagePath;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    course.title = title;
    course.description = description;
    course.instructor = instructor; // Mise à jour de l'ObjectId de l'instructor
    course.duration = duration;
    course.price = price;
    course.rating = rating || 0;
    course.image = image;

    await course.save();
    const populatedCourse = await Course.findById(course._id).populate('instructor', 'firstName lastName email');
    res.json(populatedCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a course (Admin only)
// routes/courses.js
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }
    // Replace course.remove() with Course.deleteOne()
    await Course.deleteOne({ _id: req.params.id });
    res.json({ message: 'Formation supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;