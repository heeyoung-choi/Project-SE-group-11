import React from 'react';
import '../styles/FilterBar.css';

function FilterBar({date, setDate, onFilter}) {
  return (
    <div className="filter-bar">
      <div className="filter-inputs">
        <div>
          <label>Date:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>
      </div>
      <button className="filter-button" onClick={onFilter}>Filter</button>
    </div>
  );
}

export default FilterBar;
