import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search teams..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="search-bar-input"
      />
      <button onClick={handleSearch} className="search-bar-button">
        Search
      </button>
    </div>
  );
}

export default SearchBar;
