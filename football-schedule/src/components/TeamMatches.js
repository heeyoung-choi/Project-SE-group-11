import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/TeamMatches.css";

function TeamMatches() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allMatches, setAllMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // "upcoming", "finished", or "live"
  const [viewMode, setViewMode] = useState("upcoming");

  // Fetch all team matches (season=2024) once
  useEffect(() => {
    const fetchTeamAll = async () => {
      setLoading(true);
      setError(false);
      try {
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
          throw new Error("Failed to fetch team matches");
        }
        const data = await response.json();
        setAllMatches(data.response || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };
    fetchTeamAll();
  }, [id]);

  // Fetch live matches for this team
  const fetchLiveMatches = async () => {
    try {
      const response = await fetch(
        `https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all&team=${id}`,
        {
          headers: {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "29e2cc0a7bmshbf12442884fb0cap1d846ajsneb0677a7ed00", // <-- Replace
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch live matches");
      }
      const data = await response.json();
      setLiveMatches(data.response || []);
    } catch (err) {
      console.error(err);
      // Keep liveMatches empty on error
    }
  };

  // If user clicks "LIVE" button, fetch the live matches
  useEffect(() => {
    if (viewMode === "live") {
      fetchLiveMatches();
    }
    // eslint-disable-next-line
  }, [viewMode]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">Failed to load matches</div>;

  // Filter allMatches for "upcoming" or "finished"
  let finalMatches = [];
  if (viewMode === "finished") {
    finalMatches = allMatches.filter(
      (m) => m.fixture.status.short === "FT"
    );
  } else if (viewMode === "upcoming") {
    finalMatches = allMatches.filter(
      (m) => m.fixture.status.short === "NS"
    );
  } else {
    // "live" => use liveMatches array
    finalMatches = liveMatches;
  }

  return (
    <div className="team-matches-container">
      <button className="go-back-button" onClick={() => navigate("/")}>
        &larr; Go Back
      </button>

      <h2>Team Matches (Season 2024)</h2>

      {/* Button row on the right */}
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
          <button
            className={viewMode === "live" ? "active" : ""}
            onClick={() => setViewMode("live")}
          >
            LIVE <span className="red-dot">●</span>
          </button>
        </div>
      </div>

      {finalMatches.length === 0 ? (
        <p className="no-matches">Matches not found.</p>
      ) : (
        <div className="team-matches-list">
          {finalMatches.map((match) => {
            const { fixture, teams, league, goals } = match;
            const dateStr = new Date(fixture.date).toLocaleString();

            return (
              <div key={fixture.id} className="team-match-card">
                <h3 className="league-title">
                  {league.name} ({league.country})
                </h3>
                <p className="fixture-date">{dateStr}</p>

                <div className="teams-centered">
                  {/* HOME */}
                  <div className="single-team">
                    <img
                      src={teams.home.logo}
                      alt={teams.home.name}
                      className="team-logo"
                    />
                    <p className="team-name">{teams.home.name}</p>
                    {/* Show score if finished or live */}
                    {(viewMode === "finished" || viewMode === "live") && (
                      <div className="score-big">{goals.home ?? "-"}</div>
                    )}
                  </div>

                  <div className="vs-text">VS</div>

                  {/* AWAY */}
                  <div className="single-team">
                    <img
                      src={teams.away.logo}
                      alt={teams.away.name}
                      className="team-logo"
                    />
                    <p className="team-name">{teams.away.name}</p>
                    {(viewMode === "finished" || viewMode === "live") && (
                      <div className="score-big">{goals.away ?? "-"}</div>
                    )}
                  </div>
                </div>

                <p className="venue-text">
                  Venue: {fixture.venue?.name || "N/A"}
                </p>

                {/* If LIVE, show elapsed time & status.long */}
                {viewMode === "live" && fixture.status.elapsed != null && (
                  <p className="live-extra">
                    Time Elapsed: {fixture.status.elapsed}’ ({fixture.status.long})
                  </p>
                )}

                {/* Otherwise show normal status */}
                {viewMode !== "live" && (
                  <p className="status-text">
                    Status: {fixture.status.short} (
                    {fixture.status.long || "Unknown"})
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TeamMatches;
