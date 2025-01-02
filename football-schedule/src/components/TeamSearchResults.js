import React from "react";
import { Link } from "react-router-dom";
import "../styles/TeamSearchResults.css";

function TeamSearchResults({ teams }) {
  if (!teams || teams.length === 0) {
    return <div className="no-results">No teams found.</div>;
  }

  return (
    <div className="team-search-results-container">
      {/* Go Back button removed as requested */}

      <h2>Search Results</h2>
      <div className="team-search-list">
        {teams.map(({ team, venue }) => (
          <div key={team.id} className="team-card">
            <img src={team.logo} alt={team.name} className="team-logo" />
            <h3 className="team-name">{team.name}</h3>
            <p>
              <strong>Code:</strong> {team.code || "N/A"}
            </p>
            <p>
              <strong>Country:</strong> {team.country}
            </p>
            <p>
              <strong>Founded:</strong> {team.founded || "N/A"}
            </p>
            {venue && (
              <>
                <p>
                  <strong>Venue:</strong> {venue.name} ({venue.city})
                </p>
                <p>
                  <strong>Capacity:</strong> {venue.capacity || "N/A"}
                </p>
              </>
            )}
            <Link to={`/teams/${team.id}`} className="view-matches-btn">
              View Matches
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamSearchResults;
