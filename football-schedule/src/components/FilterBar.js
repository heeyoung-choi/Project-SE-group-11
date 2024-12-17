import React from 'react';
import '../styles/FilterBar.css';

function FilterBar({startDate, endDate, setStartDate, setEndDate, filterMatches}) {
  return (
    <div className="filter-bar">
      <div className="filter-inputs">
        <div>
          <label>Start Date:</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
        </div>
        <div>
          <label>End Date:</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </div>
      </div>
      <button className="filter-button" onClick={filterMatches}>Filter</button>
    </div>
  );
}

export default FilterBar;
