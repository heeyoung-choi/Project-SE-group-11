import React, { useState, useEffect } from 'react';
import FilterBar from './components/FilterBar';
import MatchList from './components/MatchList';
import './App.css';

function App() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api-football-v1.p.rapidapi.com/v3/fixtures?next=70",
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
        setFilteredMatches(data.response || []);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const filterMatches = () => {
    if (!startDate || !endDate) {
      setFilteredMatches(matches);
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = matches.filter((m) => {
      const matchDate = new Date(m.fixture.date);
      return matchDate >= start && matchDate <= end;
    });
    setFilteredMatches(filtered);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Match Schedules</h1>
      </header>
      <FilterBar 
        startDate={startDate} 
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        filterMatches={filterMatches}
      />
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">Failed to load matches.</div>}
      {!loading && filteredMatches.length === 0 && !error && (
        <div className="no-matches">No matches are currently scheduled.</div>
      )}
      {!loading && !error && filteredMatches.length > 0 && (
        <MatchList matches={filteredMatches} />
      )}
    </div>
  );
}

export default App;
