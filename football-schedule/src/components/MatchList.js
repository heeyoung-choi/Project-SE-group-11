import React from 'react';
import '../styles/MatchList.css';

function MatchList({ matches }) {
  return (
    <div className="match-list">
      {matches.map((match) => {
        const { fixture, teams, league } = match;
        const date = new Date(fixture.date);
        const options = { 
          year: 'numeric', month: 'long', day: 'numeric', 
          hour: '2-digit', minute: '2-digit', timeZone: 'UTC' 
        };
        const formattedDate = date.toLocaleDateString(undefined, options);
        const [matchDate, matchTime] = formattedDate.split(', ');

        return (
          <div key={fixture.id} className="match-card">
            <div className="match-info">
              <div className="date-time">
                <p>{matchDate}</p>
                <p>{matchTime}</p>
              </div>
              <div className="teams">
                <div className="team-block">
                  <img src={teams.home.logo} alt={`${teams.home.name} logo`} />
                  <p>{teams.home.name}</p>
                </div>
                <div className="vs-text">VS</div>
                <div className="team-block">
                  <img src={teams.away.logo} alt={`${teams.away.name} logo`} />
                  <p>{teams.away.name}</p>
                </div>
              </div>
              <div className="venue">
                <p>{fixture.venue?.name || 'Unknown Venue'}</p>
              </div>
              <div className="league-name">
                <p>{league.name} - {league.country}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MatchList;
