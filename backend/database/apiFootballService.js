const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const API_URL = "https://api-football-v1.p.rapidapi.com/v3/fixtures?date=2024-12-15";
const HEADERS = {
    "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    "x-rapidapi-key": "6c4362965bmshc7357b4fd26115cp136a72jsnbea643c8c40d"
  };

  const fetchAndSaveEPLFixtures = async () => {
    try {
      // Fetch data from API
      const response = await axios.get(API_URL, {
        headers: HEADERS,
      });
  
      let data = response.data;
  
      // Filter fixtures belonging to EPL (league.id === 39)
      const eplFixtures = data.response.filter((fixture) => fixture.league.id === 39);
  
      // Save filtered EPL fixtures to JSON file
      const filePath = './epl_fixtures.json'; // Specify file path
      fs.writeFileSync(filePath, JSON.stringify(eplFixtures, null, 2)); // Pretty-print JSON with 2 spaces
  
      console.log(`EPL fixtures have been saved to ${filePath}.`);
    } catch (error) {
      console.error('Error fetching or saving EPL fixtures:', error.message);
    }
  };
  
  fetchAndSaveEPLFixtures();