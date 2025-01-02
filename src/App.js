import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import FilterBar from "./components/FilterBar";
import MatchList from "./components/MatchList";
import SearchBar from "./components/SearchBar";
import TeamSearchResults from "./components/TeamSearchResults";
import TeamMatches from "./components/TeamMatches";
import LoginForm from "./components/LoginForm";

import "./App.css";
import "./styles/FilterBar.css";
import "./styles/MatchList.css";
import "./styles/SearchBar.css";
import "./styles/TeamSearchResults.css";
import "./styles/TeamMatches.css";
import "./styles/NavBar.css";

// Icons & Dropdown (if you need them)
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import Dropdown from "react-bootstrap/Dropdown";

function App() {
  const todayDate = new Date().toISOString().split("T")[0];

  // States for daily matches & search
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [date, setDate] = useState(todayDate);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // ---- 1) Fetch daily matches (with leftover NS filtering) ----
  const fetchMatches = async (selectedDate) => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${selectedDate}`,
        {
          headers: {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "6c4362965bmshc7357b4fd26115cp136a72jsnbea643c8c40d",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch daily matches");
      }

      const data = await response.json();
      let fetchedMatches = data.response || [];

      // Remove leftover "NS" from the past
      const nowUnix = Math.floor(Date.now() / 1000);
      fetchedMatches = fetchedMatches.filter((match) => {
        const matchTime = match.fixture.timestamp;
        if (matchTime < nowUnix && match.fixture.status.short === "NS") {
          return false;
        }
        return true;
      });

      setMatches(fetchedMatches);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  };

  // ---- 2) Search for teams by name ----
  const searchTeams = async (keyword) => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch(
        `https://api-football-v1.p.rapidapi.com/v3/teams?search=${keyword}`,
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
      setTeams(data.response || []);
      // Clear daily matches so we only see the team results
      setMatches([]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  };

  // On date change, fetch daily matches if we have no team results
  useEffect(() => {
    if (teams.length === 0) {
      fetchMatches(date);
    }
    // eslint-disable-next-line
  }, [date]);

  const handleFilter = () => {
    setTeams([]);
    fetchMatches(date);
  };

  // ----------------------------//
  // 3) Auth / Login
  // ----------------------------//
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // After login, redirect to home or wherever
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Router>
      <div className="app-background">
        {/* HEADER */}
        <header className="header">
          <h1>Match Schedules</h1>
        </header>

        {/* MAIN NAVIGATION */}
        <Navigation />

        {/* Loading / Error states */}
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-message">Failed to load data.</div>}

        {/* Define all routes */}
        <Routes>
          {/* 1) HOME ("/") => daily matches & team search */}
          <Route
            path="/"
            element={
              <HomePage
                matches={matches}
                teams={teams}
                loading={loading}
                error={error}
                date={date}
                setDate={setDate}
                handleFilter={handleFilter}
                searchTeams={searchTeams}
              />
            }
          />

          {/* 2) TeamMatches => shows matches for a selected team */}
          <Route path="/teams/:id" element={<TeamMatches />} />

          {/* 3) About page */}
          <Route path="/about" element={<AboutPage />} />

          {/* 4) Login page */}
          <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />

          {/* 5) User info */}
          <Route path="/userinfo" element={<UserInfoPage />} />

          {/* 6) 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

// ----------------------------------------------------------------------
// NAVIGATION (uses <Link> from react-router-dom instead of setCurrentPage)
// ----------------------------------------------------------------------
function Navigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/"); // redirect to home
  };

  const token = localStorage.getItem("token");

  return (
    <nav>
      <ul className="nav-bar">
        {/* We use <Link> instead of an onClick to set route */}
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>

        {!token ? (
          <li className="login-button">
            <Link to="/login">
              Login <LoginIcon />
            </Link>
          </li>
        ) : (
          <li className="account-button">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <PersonIcon />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate("/userinfo")}>
                  User Info
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        )}
      </ul>
    </nav>
  );
}

// ----------------------------------------------------------------------
// HOME PAGE => daily matches & team search results
// ----------------------------------------------------------------------
function HomePage({
  matches,
  teams,
  loading,
  error,
  date,
  setDate,
  handleFilter,
  searchTeams,
}) {
  return (
    <div className="home-content">
      {/* FilterBar & SearchBar up top */}
      <div className="top-bar">
        <FilterBar date={date} setDate={setDate} onFilter={handleFilter} />
        <SearchBar onSearch={searchTeams} />
      </div>

      {/* If we have team search results */}
      {!loading && teams.length > 0 && <TeamSearchResults teams={teams} />}

      {/* If we have daily matches (and no team results) */}
      {!loading && teams.length === 0 && matches.length > 0 && (
        <MatchList matches={matches} />
      )}

      {/* If no matches or teams, show "No matches found" (when not loading/error) */}
      {!loading && !error && teams.length === 0 && matches.length === 0 && (
        <div className="no-matches">No matches found.</div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// About Page
// ----------------------------------------------------------------------
function AboutPage() {
  return (
    <div>
      <h1>About</h1>
      <p>This project is designed to help users search and predict matches.</p>
    </div>
  );
}

// ----------------------------------------------------------------------
// User Info Page
// ----------------------------------------------------------------------
function UserInfoPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div>
        <h1>Can't get user info.</h1>
      </div>
    );
  }
  return (
    <div className="user-info">
      <h2>User Information</h2>
      <p>
        <strong>Name:</strong> {user.email}
      </p>
      <p>
        <strong>Email:</strong> {user.displayName}
      </p>
    </div>
  );
}

// ----------------------------------------------------------------------
// 404 Page
// ----------------------------------------------------------------------
function NotFoundPage() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
    </div>
  );
}

export default App;
