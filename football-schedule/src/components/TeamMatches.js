import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FilterBar from "./FilterBar";  // Reusing the same FilterBar component
import "../styles/TeamMatches.css";

function TeamMatches() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [teamDate, setTeamDate] = useState(""); // date filter for this team
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // "finished" or "upcoming"
  const [viewMode, setViewMode] = useState("upcoming");

  // Fetch matches for the team, optionally filtered by date
  const fetchTeamMatches = async () => {
    setLoading(true);
    setError(false);
    try {
      // If user sets a date, we pass date=? to the API
      // Otherwise, we use season=2024 (as your original code did).
      let apiUrl = "";
      if (teamDate) {
        apiUrl = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${teamDate}&team=${id}`;
      } else {
        // fallback to the "season=2024" logic
        apiUrl = `https://api-football-v1.p.rapidapi.com/v3/fixtures?season=2024&team=${id}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
          "x-rapidapi-key": "YOUR_RAPID_API_KEY_HERE", // <-- Replace
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch matches");
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

  useEffect(() => {
    fetchTeamMatches();
    // eslint-disable-next-line
  }, [id]);

  // Called when user clicks "Apply" in FilterBar
  const handleFilter = () => {
    // Re-fetch with the new teamDate
    fetchTeamMatches();
  };

  const handleGoBack = () => {
    navigate("/");
  };

  // Filter matches by FT or NS
  const filteredMatches = matches.filter((m) => {
    const status = m.fixture.status.short;
    return viewMode === "finished" ? status === "FT" : status === "NS";
  });

  if (loading) return <div className="loading">Loading matches...</div>;
  if (error) return <div className="error-message">Failed to load matches</div>;

  return (
    <div className="team-matches-container">
      <button className="go-back-button" onClick={handleGoBack}>
        &larr; Go Back
      </button>
      <h2>Team Matches</h2>

      {/* Team date filter bar */}
      <div className="team-filter">
        <FilterBar
          date={teamDate}
          setDate={setTeamDate}
          onFilter={handleFilter}
        />
      </div>

      {/* FT/NS Buttons */}
      <div className="team-matches-buttons">
        <button
          className={viewMode === "finished" ? "active" : ""}
          onClick={() => setViewMode("finished")}
        >
          Finished
        </button>
        <button
          className={viewMode === "upcoming" ? "active" : ""}
          onClick={() => setViewMode("upcoming")}
        >
          Upcoming
        </button>
      </div>

      {/* Show filtered matches or "Matches not found." */}
      {filteredMatches.length === 0 ? (
        <p className="no-matches">Matches not found.</p>
      ) : (
        <div className="team-matches-list">
          {filteredMatches.map((match) => {
            const { fixture, teams, league, goals } = match;
            const dateStr = new Date(fixture.date).toLocaleString();

            return (
              <div key={fixture.id} className="team-match-card">
                <h3 className="league-title">
                  {league.name} ({league.country})
                </h3>
                <p className="fixture-date">{dateStr}</p>

                <div className="teams-centered">
                  <div className="single-team">
                    <img
                      src={teams.home.logo}
                      alt={teams.home.name}
                      className="team-logo"
                    />
                    <p className="team-name">{teams.home.name}</p>
                    {viewMode === "finished" && (
                      <div className="score-big">{goals.home ?? "-"}</div>
                    )}
                  </div>

                  <div className="vs-text">VS</div>

                  <div className="single-team">
                    <img
                      src={teams.away.logo}
                      alt={teams.away.name}
                      className="team-logo"
                    />
                    <p className="team-name">{teams.away.name}</p>
                    {viewMode === "finished" && (
                      <div className="score-big">{goals.away ?? "-"}</div>
                    )}
                  </div>
                </div>

                <p className="venue-text">
                  Venue: {fixture.venue?.name || "N/A"}
                </p>
                <p className="status-text">
                  Status: {fixture.status.short} (
                  {fixture.status.long || "Unknown"})
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TeamMatches;
