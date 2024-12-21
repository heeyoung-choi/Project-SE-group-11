const express = require('express');
const admin = require('../firebaseAdmin'); // Firebase Admin instance
const router = express.Router();

// Predict route
router.post('/predict', async (req, res) => {
  const { userId, matchId, type, data } = req.body;

  if (!userId || !matchId || !type || !data) {
    return res.status(400).json({ error: 'All fields (userId, matchId, type, data) are required.' });
  }

  try {
    const db = admin.firestore(); // Initialize Firestore
    const prediction = {
      userId,
      matchId,
      type,
      data,
      timestamp: new Date().toISOString(), // Add a timestamp
    };

    // Add prediction to Firestore
    await db.collection('predictions').add(prediction);

    res.json({ message: 'Prediction saved successfully', prediction });
  } catch (error) {
    console.error('Error saving prediction:', error.message);
    res.status(500).json({ error: 'Failed to save prediction' });
  }
});

module.exports = router;
