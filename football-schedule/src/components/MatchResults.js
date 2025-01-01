import React from 'react';
import '../styles/MatchResults.css';

function MatchResults({ team, finishedMatches, upcomingMatches }) {
    console.log(team.country);
  return (
    <div className="match-results">
      {/* Team Information Section */}
      <div className="team-info">
        <img src={team.logo} alt={`${team.name} Logo`} />
        <h2>{team.name}</h2>
        <div className="general-info">
          <p><strong>Country:</strong> {team.country}</p>
          <p><strong>League:</strong> {team.league}</p>
          <p><strong>Founded:</strong> {team.founded}</p>
          <p><strong>Stadium:</strong> {team.stadium}</p>
        </div>
      </div>

      {/* Match Sections */}
      <div className="match-sections">
        {/* Finished Matches Section */}
        <div className="match-section">
          <h2>Finished Matches</h2>
          {finishedMatches.length > 0 ? (
            finishedMatches.map((match) => (
              <div key={match.fixture.id} className="match-card">
                <div className="team-info-block">
                  <img src={match.teams.home.logo} alt={match.teams.home.name} />
                  <span className="team-name">{match.teams.home.name}</span>
                </div>
                <span className="vs-text">VS</span>
                <div className="team-info-block">
                  <img src={match.teams.away.logo} alt={match.teams.away.name} />
                  <span className="team-name">{match.teams.away.name}</span>
                </div>
                <div className="date-time">
                  {new Date(match.fixture.date).toLocaleString()}
                </div>
                <div className="venue">{match.fixture.venue.name || 'Unknown Venue'}</div>
              </div>
            ))
          ) : (
            <p>No finished matches found.</p>
          )}
        </div>

        {/* Upcoming Matches Section */}
        <div className="match-section">
          <h2>Upcoming Matches</h2>
          {upcomingMatches.length > 0 ? (
            upcomingMatches.map((match) => (
              <div key={match.fixture.id} className="match-card">
                <div className="team-info-block">
                  <img src={match.teams.home.logo} alt={match.teams.home.name} />
                  <span className="team-name">{match.teams.home.name}</span>
                </div>
                <span className="vs-text">VS</span>
                <div className="team-info-block">
                  <img src={match.teams.away.logo} alt={match.teams.away.name} />
                  <span className="team-name">{match.teams.away.name}</span>
                </div>
                <div className="date-time">
                  {new Date(match.fixture.date).toLocaleString()}
                </div>
                <div className="venue">{match.fixture.venue.name || 'Unknown Venue'}</div>
              </div>
            ))
          ) : (
            <p>No upcoming matches found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MatchResults;
