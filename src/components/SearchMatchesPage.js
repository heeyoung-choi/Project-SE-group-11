import React, { useState } from "react";
import DatePicker from "react-datepicker";
import MatchItem from "./MatchItem";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import ReactPaginate from "react-paginate";
import "../styles/SearchMatchesPage.css"

import "react-datepicker/dist/react-datepicker.css";
const SearchMatchesPage =  ({matchesPerPage}) => {
    const [matchOffset, setMatchOffset] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [searchResult, setSearchResult] = useState('');
    const handleSearchClick = async() => 
    {
        let dateString = new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(startDate);
        console.log(dateString)
        const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${dateString}`;
        const options = {
            method: 'GET',
            headers: {
                  "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
                    "x-rapidapi-key": "6c4362965bmshc7357b4fd26115cp136a72jsnbea643c8c40d"
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            setSearchResult(result.response);
        } catch (error) {
            console.error(error);
        }
    }
    const handlePageClick = (event) =>
    {
        const newOffset = (searchResult  && searchResult.length) ? ((event.selected * matchesPerPage) % searchResult.length) : 0;
        console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setMatchOffset(newOffset);
    }
    return (<div>
      <h1>Search Matches</h1>
      <p>Search for matches by date, team, or stadium.</p>
      <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
      <Button variant="contained" startIcon={<SearchIcon/>} onClick={handleSearchClick}>Search</Button>
      <h2>Search Results</h2>
        {
        /* <p> {searchResult ? searchResult.response[0] : 0} </p> */
        <div className="match-list">
        {
        (searchResult && searchResult.length) ? 
        (
            searchResult.slice(matchOffset, matchOffset + matchesPerPage).map((match) => (
                <MatchItem match={match} />
            ))
        ): ""
        }
        </div>

        }
       <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={(searchResult  && searchResult.length) ? (Math.ceil(searchResult.length / matchesPerPage)) : 0}
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
    </div>);
};

export default SearchMatchesPage;