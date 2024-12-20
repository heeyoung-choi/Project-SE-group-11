const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRoute = require('./authentication/firebaseAuth'); // Import the login route

const app = express();
const PORT = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/auth', loginRoute); // Use the login route with the '/auth' prefix

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
