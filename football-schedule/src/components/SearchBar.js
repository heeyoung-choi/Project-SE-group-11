import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [teamName, setTeamName] = useState("");

  const handleSearch = () => {
    if (teamName.trim()) {
      onSearch(teamName.trim());
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter team name..."
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
