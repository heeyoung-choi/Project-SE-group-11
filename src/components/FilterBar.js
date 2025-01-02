import React from "react";

function FilterBar({ date, setDate, onFilter }) {
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  return (
    <div className="filter-bar-container">
      <label className="filter-label">Filter by date:</label>
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        className="filter-date"
      />
      <button onClick={onFilter} className="filter-button">
        Apply
      </button>
    </div>
  );
}

export default FilterBar;
