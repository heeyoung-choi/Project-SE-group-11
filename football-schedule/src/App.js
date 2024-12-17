import React, { useState, useEffect } from 'react';
import FilterBar from './components/FilterBar';
import MatchList from './components/MatchList';
import './App.css';

function App() {
  const todayDate = new Date().toISOString().split('T')[0];
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [date, setDate] = useState(todayDate);
  const fetchMatches = async (selectedDate) => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(
        `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${selectedDate}`,
        {
          headers: {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "6c4362965bmshc7357b4fd26115cp136a72jsnbea643c8c40d"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      setMatches(data.response || []);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(date);
  }, [date]);

  const handleFilter = () => {
    fetchMatches(date);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Match Schedules</h1>
      </header>
      <FilterBar 
        date={date} 
        setDate={setDate}
        onFilter={handleFilter}
      />
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">Failed to load matches.</div>}
      {!loading && matches.length === 0 && !error && (
        <div className="no-matches">No matches are currently scheduled.</div>
      )}
      {!loading && !error && matches.length > 0 && (
        <MatchList matches={matches} />
      )}
    </div>
  );
}

export default App;
