import React, { useState } from "react";
import "../styles/MatchList.css";

function MatchList({ matches }) {
  // "finished" or "upcoming"
  const [viewMode, setViewMode] = useState("upcoming");

  const filteredMatches = matches.filter((m) => {
    const status = m.fixture.status.short;
    return viewMode === "finished" ? status === "FT" : status === "NS";
  });

  return (
    <div className="match-list-container">
      <div className="match-list-header">
        <div></div> {/* empty space on left */}
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
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <p className="no-matches">Matches not found.</p>
      ) : (
        <div className="match-list">
          {filteredMatches.map((match) => {
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
                  {/* HOME */}
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

                  {/* AWAY */}
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

export default MatchList;
