import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "../styles/MatchList.css";

function MatchList({ matches, matchesPerPage = 10 }) {
  const [viewMode, setViewMode] = useState("upcoming");
  const [liveMatches, setLiveMatches] = useState([]);
  const [matchOffset, setMatchOffset] = useState(0);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const response = await fetch(
          "https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all",
          {
            headers: {
              "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
              "x-rapidapi-key": "6c4362965bmshc7357b4fd26115cp136a72jsnbea643c8c40d",
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
      }
    };

    if (viewMode === "live") {
      fetchLiveMatches();
    }
  }, [viewMode]);

  const filteredDaily = matches.filter((m) => {
    const status = m.fixture.status.short;
    return viewMode === "finished" ? status === "FT" : status === "NS";
  });

  let finalMatches = filteredDaily;
  if (viewMode === "live") {
    finalMatches = liveMatches;
  }

  const paginatedMatches = finalMatches.slice(
    matchOffset,
    matchOffset + matchesPerPage
  );

  const handlePageClick = (event) => {
    const newOffset =
      finalMatches.length > 0
        ? (event.selected * matchesPerPage) % finalMatches.length
        : 0;
    setMatchOffset(newOffset);
  };

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

      <div className="match-list">
        {paginatedMatches.map((match) => {
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
                <div className="single-team">
                  <img
                    src={teams.home.logo}
                    alt={teams.home.name}
                    className="team-logo"
                  />
                  <p className="team-name">{teams.home.name}</p>
                  {(viewMode === "finished" || viewMode === "live") && (
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
                  {(viewMode === "finished" || viewMode === "live") && (
                    <div className="score-big">{goals.away ?? "-"}</div>
                  )}
                </div>
              </div>

              <p className="venue-text">
                Venue: {fixture.venue?.name || "N/A"}
              </p>

              {viewMode === "live" && fixture.status.elapsed != null && (
                <p className="live-extra">
                  Time Elapsed: {fixture.status.elapsed}’
                  {" ("}
                  {fixture.status.long}
                  {")"}
                </p>
              )}

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

      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={Math.ceil(finalMatches.length / matchesPerPage)}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </div>
  );
}

export default MatchList;
