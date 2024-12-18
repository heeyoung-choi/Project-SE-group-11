
const fs = require('fs'); // Import the file system module
const { fetchDataFromAPIFootball } = require('./apiFootballService'); // Import as an object

const run = async () => {
  try {
    const data = await fetchDataFromAPIFootball();

    // Save data to JSON file
    const filePath = './fixtures.json'; // Specify file path
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // Pretty-print JSON with 2 spaces
    
  } catch (error) {
    console.error('Error in app.js:', error.message);
  }
};

run(); // Call the function
