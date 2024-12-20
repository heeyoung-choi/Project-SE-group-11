const express = require('express');
const admin = require('./firebaseAdmin'); // Import the shared Firebase Admin instance

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    // Fetch user by email
    const user = await admin.auth().getUserByEmail(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Here, you would compare the password (use a secure method, e.g., bcrypt)

    // Generate a custom token to simulate a successful login
    const customToken = await admin.auth().createCustomToken(user.uid);

    res.json({
      message: 'Login successful',
      token: customToken,
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
