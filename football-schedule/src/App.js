import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import FilterBar from "./components/FilterBar";
import MatchList from "./components/MatchList";
import SearchBar from "./components/SearchBar";
import TeamSearchResults from "./components/TeamSearchResults";

import "./App.css";
import "./styles/FilterBar.css";
import "./styles/MatchList.css";
import "./styles/SearchBar.css";
import "./styles/TeamSearchResults.css";

function App() {
  const todayDate = new Date().toISOString().split("T")[0];

  // States for daily matches
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);      
  const [date, setDate] = useState(todayDate);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // -----------------------------------------
  // 1) Fetch daily matches for the given date
  // -----------------------------------------
  const fetchMatches = async (selectedDate) => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${selectedDate}`,
        {
          headers: {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "29e2cc0a7bmshbf12442884fb0cap1d846ajsneb0677a7ed00",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch daily matches");
      }

      const data = await response.json();
      setMatches(data.response || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  };

  // -----------------------------------------
  // 2) Search for teams by name
  // -----------------------------------------
  const searchTeams = async (keyword) => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        `https://api-football-v1.p.rapidapi.com/v3/teams?search=${keyword}`,
        {
          headers: {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "29e2cc0a7bmshbf12442884fb0cap1d846ajsneb0677a7ed00",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search teams");
      }

      const data = await response.json();
      setTeams(data.response || []);
      setMatches([]); // Clear daily matches so we only see the search results
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  };

  // On load or date change, if we're NOT displaying team results, fetch daily matches
  useEffect(() => {
    if (teams.length === 0) {
      fetchMatches(date);
    }
    // eslint-disable-next-line
  }, [date]);

  // Filter button handler
  const handleFilter = () => {
    // If we had searched for teams, clear them
    setTeams([]);
    fetchMatches(date);
  };

  // The home page ("/")
  const HomePage = () => (
    <div className="home-content">
      {/* If we have teams from search, show them */}
      {!loading && teams.length > 0 && (
        <TeamSearchResults teams={teams} />
      )}

      {/* If no search results, show daily matches */}
      {!loading && teams.length === 0 && matches.length > 0 && (
        <MatchList matches={matches} />
      )}

      {/* If everything is empty and not loading, "No matches found" */}
      {!loading && !error && teams.length === 0 && matches.length === 0 && (
        <div className="no-matches">No matches found.</div>
      )}
    </div>
  );

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1>Match Schedules</h1>
        </header>

        {/* Filter date on the left, search bar on the right */}
        <div className="top-bar">
          <FilterBar date={date} setDate={setDate} onFilter={handleFilter} />
          <SearchBar onSearch={searchTeams} />
        </div>

        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-message">Failed to load data.</div>}

        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* You can have a separate route for team matches if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
