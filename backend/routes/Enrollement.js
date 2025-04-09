// routes/enrollments.js
const express = require('express');
const router = express.Router();
const Enrollment = require('../model/Enrollement'); // Corrigez la faute de frappe (Enrollement -> Enrollment)
const { auth } = require('../middleware/auth');

// S'inscrire à une formation (tous les utilisateurs connectés peuvent le faire)
router.post('/', auth(), async (req, res) => {
  try {
    const { courseId, nom, prenom, email, telephone } = req.body;

    // Vérifier si l'utilisateur est déjà inscrit
    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Vous êtes déjà inscrit à cette formation' });
    }

    const enrollment = new Enrollment({
      user: req.user.id,
      course: courseId,
      nom,
      prenom,
      email,
      telephone
    });

    const savedEnrollment = await enrollment.save();

    // Populer les données du cours et de l'utilisateur
    await savedEnrollment.populate('course', 'title');
    await savedEnrollment.populate('user', 'email');

    res.status(201).json(savedEnrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/contact', async (req, res) => {
    try {
      const messages = await Contact.find().sort({ createdAt: -1 });
      res.status(200).json(messages);
    } catch (err) {
      console.error('Erreur lors de la récupération des messages:', err);
      res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
  });

module.exports = router;