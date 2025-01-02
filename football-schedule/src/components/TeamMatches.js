import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/TeamMatches.css";

function TeamMatches() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // "finished" or "upcoming"
  const [viewMode, setViewMode] = useState("upcoming");

  useEffect(() => {
    const fetchTeamMatches = async () => {
      setLoading(true);
      setError(false);
      try {
        // Just fetch season=2024 for the given team (no date filter)
        const response = await fetch(
          `https://api-football-v1.p.rapidapi.com/v3/fixtures?season=2024&team=${id}`,
          {
            headers: {
              "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
              "x-rapidapi-key": "29e2cc0a7bmshbf12442884fb0cap1d846ajsneb0677a7ed00", // <-- Replace
            },
          }
        );

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

    fetchTeamMatches();
  }, [id]);

  // Filter by FT or NS
  const filteredMatches = matches.filter((m) => {
    const status = m.fixture.status.short;
    return viewMode === "finished" ? status === "FT" : status === "NS";
  });

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">Failed to load matches</div>;

  return (
    <div className="team-matches-container">
      {/* If you still want a go back button, keep it. If not, remove. 
          The user didn't say to remove it from TeamMatches, so let's keep it. */}
      <button className="go-back-button" onClick={() => navigate("/")}>
        &larr; Go Back
      </button>

      <h2>Team Matches (Season 2024)</h2>

      {/* Finished/Upcoming buttons on the right */}
      <div className="team-matches-header">
        <div className="spacer"></div>
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
      </div>

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
                  {/* HOME TEAM */}
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

                  {/* AWAY TEAM */}
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
