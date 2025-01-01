import React, { useState, useEffect } from 'react';
import FilterBar from './components/FilterBar';
import MatchList from './components/MatchList';
import SearchBar from './components/SearchBar';
import './styles/SearchBar.css';
import './styles/FilterBar.css';
import './styles/MatchList.css';
import './styles/MatchResults.css';
import './App.css';

function App() {
  const todayDate = new Date().toISOString().split('T')[0];
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [date, setDate] = useState(todayDate);
  const [teamMatches, setTeamMatches] = useState(null);

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

  const fetchTeamMatches = async (teamName) => {
    setLoading(true);
    setError(false);
    try {
      // Step 1: Fetch matches for the current date to get `season_id` and `team_id`.
      const response = await fetch(
        `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${todayDate}`,
        {
          headers: {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "6c4362965bmshc7357b4fd26115cp136a72jsnbea643c8c40d"
          }
        }
      );
      const data = await response.json();
      const teamData = data.response.find(
        (match) =>
          match.teams.home.name.toLowerCase() === teamName.toLowerCase() ||
          match.teams.away.name.toLowerCase() === teamName.toLowerCase()
      );

      if (!teamData) {
        setTeamMatches([]);
        setLoading(false);
        return;
      }

      const seasonId = teamData.league.season;
      const teamId =
        teamData.teams.home.name.toLowerCase() === teamName.toLowerCase()
          ? teamData.teams.home.id
          : teamData.teams.away.id;

      // Step 2: Fetch matches for the team using `season_id` and `team_id`.
      const teamMatchesResponse = await fetch(
        `https://api-football-v1.p.rapidapi.com/v3/fixtures?season=${seasonId}&team=${teamId}`,
        {
          headers: {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "6c4362965bmshc7357b4fd26115cp136a72jsnbea643c8c40d"
          }
        }
      );
      const teamMatchesData = await teamMatchesResponse.json();

      // Step 3: Separate matches into "Finished" and "Not Started" categories.
      const finishedMatches = teamMatchesData.response
        .filter((match) => match.fixture.status.short === "FT")
        .slice(0, 5); // Limit to 5 matches.
      const upcomingMatches = teamMatchesData.response
        .filter((match) => match.fixture.status.short === "NS")
        .slice(0, 5); // Limit to 5 matches.

      setTeamMatches({ finishedMatches, upcomingMatches });
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
      <SearchBar onSearch={fetchTeamMatches} />
      <FilterBar 
        date={date} 
        setDate={setDate}
        onFilter={handleFilter}
      />
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">Failed to load matches.</div>}
      {!loading && teamMatches && (
        <div>
          <h2>Finished Matches</h2>
          {teamMatches.finishedMatches.map((match) => (
            <MatchList key={match.fixture.id} matches={[match]} />
          ))}

          <h2>Upcoming Matches</h2>
          {teamMatches.upcomingMatches.map((match) => (
            <MatchList key={match.fixture.id} matches={[match]} />
          ))}
        </div>
      )}
      {!loading && !teamMatches && matches.length > 0 && (
        <MatchList matches={matches} />
      )}
    </div>
  );
}

export default App;
