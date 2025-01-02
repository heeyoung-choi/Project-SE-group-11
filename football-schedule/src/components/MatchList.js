import React, { useState, useEffect } from "react";
import "../styles/MatchList.css";

function MatchList({ matches }) {
  // "finished" or "upcoming" or "live"
  const [viewMode, setViewMode] = useState("upcoming");

  // We'll store daily matches in `matches` (prop).
  // We'll store live matches from "fixtures?live=all" in `liveMatches`.
  const [liveMatches, setLiveMatches] = useState([]);

  // Fetch live matches only when viewMode changes to "live"
  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const response = await fetch(
          "https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all",
          {
            headers: {
              "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
              "x-rapidapi-key": "29e2cc0a7bmshbf12442884fb0cap1d846ajsneb0677a7ed00",
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
        // If live fetch fails, we just keep liveMatches empty
      }
    };

    if (viewMode === "live") {
      fetchLiveMatches();
    }
  }, [viewMode]);

  // Filter daily matches for "finished" or "upcoming"
  const filteredDaily = matches.filter((m) => {
    const status = m.fixture.status.short;
    return viewMode === "finished" ? status === "FT" : status === "NS";
  });

  // Decide which array to show
  let finalMatches = filteredDaily;
  if (viewMode === "live") {
    finalMatches = liveMatches;
  }

  // If we ended up with no matches, show "Matches not found"
  if (finalMatches.length === 0) {
    return (
      <div className="match-list-container">
        <div className="match-list-header">
          <div></div>
          <div className="buttons">
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
        <p className="no-matches">Matches not found.</p>
      </div>
    );
  }

  return (
    <div className="match-list-container">
      {/* Buttons row */}
      <div className="match-list-header">
        <div></div>
        <div className="buttons">
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

      {/* Render finalMatches array */}
      <div className="match-list">
        {finalMatches.map((match) => {
          const { fixture, teams, league, goals } = match;
          const dateObj = new Date(fixture.date);
          const formattedDate = dateObj.toLocaleString();

          return (
            <div key={fixture.id} className="match-card">
              <h3 className="league-title">
                {league.name} ({league.country})
              </h3>
              <p className="fixture-date">{formattedDate}</p>

              <div className="teams-centered">
                {/* HOME TEAM */}
                <div className="single-team">
                  <img
                    src={teams.home.logo}
                    alt={teams.home.name}
                    className="team-logo"
                  />
                  <p className="team-name">{teams.home.name}</p>
                  {/* Show partial score if it's Finished or Live */}
                  {(viewMode === "finished" || viewMode === "live") && (
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
                  {(viewMode === "finished" || viewMode === "live") && (
                    <div className="score-big">{goals.away ?? "-"}</div>
                  )}
                </div>
              </div>

              <p className="venue-text">
                Venue: {fixture.venue?.name || "N/A"}
              </p>

              {/* For live matches, show time elapsed & status */}
              {viewMode === "live" && fixture.status.elapsed != null && (
                <p className="live-extra">
                  Time Elapsed: {fixture.status.elapsed}’
                  {" ("}
                  {fixture.status.long}
                  {")"}
                </p>
              )}

              {/* For finished or upcoming, show normal status */}
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
    </div>
  );
}

export default MatchList;
