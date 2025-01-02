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
import TeamMatches from "./components/TeamMatches";

import "./App.css";          // Our main app styling
import "./styles/FilterBar.css";
import "./styles/MatchList.css";
import "./styles/SearchBar.css";
import "./styles/TeamSearchResults.css";
import "./styles/TeamMatches.css";

function App() {
  const todayDate = new Date().toISOString().split("T")[0];

  const [matches, setMatches] = useState([]);  // daily matches
  const [teams, setTeams] = useState([]);      // search results
  const [date, setDate] = useState(todayDate);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // --------------------------
  // 1. Fetch daily matches
  // --------------------------
  const fetchMatches = async (selectedDate) => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${selectedDate}`,
        {
          headers: {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "6c4362965bmshc7357b4fd26115cp136a72jsnbea643c8c40d",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch daily matches");
      }
  
      const data = await response.json();
      let fetchedMatches = data.response || [];
  
      // Get current Unix timestamp (in seconds)
      const nowUnix = Math.floor(Date.now() / 1000);
  
      // Filter out any "NS" matches whose time is already in the past
      fetchedMatches = fetchedMatches.filter((match) => {
        const matchTime = match.fixture.timestamp; // also in seconds
        if (matchTime < nowUnix && match.fixture.status.short === "NS") {
          return false; // remove leftover "NS" from past
        }
        return true;
      });
  
      setMatches(fetchedMatches);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  };  

  // ----------------------------
  // 2. Search for teams by name
  // ----------------------------
  const searchTeams = async (keyword) => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        `https://api-football-v1.p.rapidapi.com/v3/teams?search=${keyword}`,
        {
          headers: {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "6c4362965bmshc7357b4fd26115cp136a72jsnbea643c8c40d", // <-- Replace
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

  // Fetch daily matches on first load or whenever the date changes
  useEffect(() => {
    // Only fetch daily matches if we don't have any search results
    if (teams.length === 0) {
      fetchMatches(date);
    }
    // eslint-disable-next-line
  }, [date]);

  // Handler for the filter button
  const handleFilter = () => {
    // If we had searched for teams, reset that
    setTeams([]);
    fetchMatches(date);
  };

  // The Home page content ("/")
  const HomePage = () => (
    <div className="home-content">
      {/* If we have teams from search, show them */}
      {!loading && teams.length > 0 && <TeamSearchResults teams={teams} />}

      {/* If we have daily matches (and no search results), show them */}
      {!loading && teams.length === 0 && matches.length > 0 && (
        <MatchList matches={matches} />
      )}

      {/* If no matches or teams, show "No matches found" (when not loading/error) */}
      {!loading && !error && teams.length === 0 && matches.length === 0 && (
        <div className="no-matches">No matches found.</div>
      )}
    </div>
  );

  return (
    <Router>
      {/* 1) Our background class is app-background */}
      <div className="app-background">
        <header className="header">
          <h1>Match Schedules</h1>
        </header>

        <div className="top-bar">
          <FilterBar date={date} setDate={setDate} onFilter={handleFilter} />
          <SearchBar onSearch={searchTeams} />
        </div>

        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-message">Failed to load data.</div>}

        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* TeamMatches route */}
          <Route path="/teams/:id" element={<TeamMatches />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
