import React, { useState } from "react";
import DatePicker from "react-datepicker";
import MatchItem from "./MatchItem";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import ReactPaginate from "react-paginate";
import "../styles/SearchMatchesPage.css"
import AsyncSelect from 'react-select/async';
import "react-datepicker/dist/react-datepicker.css";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


const SearchMatchesPage =  ({matchesPerPage, onMatchFocus, setMatch}) => {
    const [matchOffset, setMatchOffset] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [searchResult, setSearchResult] = useState('');
    const [currentTeamId, setCurrentTeamId] = useState('');
    const [season, setCurrentSeason] = useState('');
    const handleSearchClick = async() => 
    {
        let dateString = new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(startDate);
        console.log(dateString);
        dateString = (dateString == "1970-01-01") ? "" : dateString;
        console.log(season)
        const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?` + (dateString ? `date=${dateString}` : "") + ((currentTeamId && currentTeamId.value)  ? `&season=${parseInt(season)}&team=${currentTeamId.value}` : '');
        console.log(url)
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
            console.log(result.response)
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
    const teamLoadOptions = async (inputValue, callback) => {
        try {
            
          const response = await fetch(
            `https://api-football-v1.p.rapidapi.com/v3/teams?search=${inputValue}` ,
            {
              headers: {
                "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
                "x-rapidapi-key": "6c4362965bmshc7357b4fd26115cp136a72jsnbea643c8c40d",
              },
            }
          );
      
          if (!response.ok) {
            throw new Error("Failed to search teams");
          }
      
          const data = await response.json();
          const teams = data.response.map((team) => ({
            label: team.team.name,
            value: team.team.id,
            logo: team.team.logo, // Including the team logo for dropdown display
          }));
      
          callback(teams);
        } catch (error) {
          console.error("Error fetching teams:", error);
          callback([]);
        }
      };
    return (<div>
      <h1>Search Matches</h1>
      <p>Search for matches by date, team, or stadium.</p>
      <div className="search-options">
      <DatePicker className="input-box" isClearable={true} selected={startDate} onChange={(date) => setStartDate(date)} />
      <AsyncSelect placeholder="Select a team..." className="async-select input-box" cacheOptions isClearable = {true}  onChange= {(s) => {setCurrentTeamId(s)}} loadOptions={teamLoadOptions} defaultOptions />
       {
        (currentTeamId && currentTeamId.value)?
       ( <InputGroup className="input-box input-group">
        <Form.Control
          placeholder="select a season"
          aria-describedby="basic-addon1"
          onChange={(event) => setCurrentSeason(event.target.value)}
        />
      </InputGroup>) : ""}
      </div>
      <Button variant="contained" startIcon={<SearchIcon/>} onClick={handleSearchClick}>Search</Button>
      <h2>Search Results</h2>
        {
        /* <p> {searchResult ? searchResult.response[0] : 0} </p> */
        <div className="match-list">
        {
        (searchResult && searchResult.length) ? 
        (
            searchResult.slice(matchOffset, matchOffset + matchesPerPage).map((match) => (
                <MatchItem className="match-item" match={match} 
                onClick= {
                    () =>
                    {
                        console.log("click");
                        onMatchFocus();
                        setMatch(match)
                    }
                }
                />
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