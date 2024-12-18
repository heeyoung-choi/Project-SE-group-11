import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';


import "react-datepicker/dist/react-datepicker.css";
const SearchMatchesPage =  () => {
    const [startDate, setStartDate] = useState(new Date());
    const [searchResult, setSearchResult] = useState('');
    const handleClick = async() => 
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
            console.log(result)
            setSearchResult(result);
        } catch (error) {
            console.error(error);
        }
    }
    return (<div>
      <h1>Search Matches</h1>
      <p>Search for matches by date, team, or stadium.</p>
      <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
      <Button variant="contained" startIcon={<SearchIcon/>} onClick={handleClick}>Search</Button>
      <h2>Search Results</h2>
        <p> {searchResult.response.length} </p>
    </div>);
};

export default SearchMatchesPage;