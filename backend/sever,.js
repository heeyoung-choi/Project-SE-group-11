const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    
    if (username === 'huydang' && password === '123') {
        res.json({ success: true, message: 'Login successful!' });
    } else{
        res.json({ success: false, message: 'Login unsuccessful!' });
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});