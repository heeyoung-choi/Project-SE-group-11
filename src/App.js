import React, { useState } from 'react';

import SearchMatchesPage from './components/SearchMatchesPage';
import LoginForm from './components/LoginForm';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import Dropdown from 'react-bootstrap/Dropdown';
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const handleLogin = async (email, password) => 
    {
      console.log("go")
      try {
        const response = await fetch('http://localhost:8000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',  // Set the content type to JSON
          },
          body: JSON.stringify({ email, password }),  // Convert the object to a JSON string
        });
    
        if (!response.ok) {
          // Handle non-200 responses
          const errorData = await response.json();
          console.log(errorData)
        }
    
        const data = await response.json();  // Parse the JSON response
        console.log('Login successful:', data);  // Handle success (e.g., save token, navigate)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setCurrentPage('home')
      } catch (error) {
        console.error('Error during login:', error);
    
        // Handle error (e.g., show error message to user)
      }
    }
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <SearchMatchesPage matchesPerPage={10} />;
      case 'about':
        return <AboutPage />;
      case 'login':
        return <LoginForm handleLogin={handleLogin} />;
      case 'userinfo':
        return <UserInfoPage/>
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div>
      <Navigation setCurrentPage={setCurrentPage} />
      <div className="page-content">{renderPage()}
      
      </div>
      
    </div>
  );
};


const Navigation = ({ setCurrentPage }) => {

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentPage('home');
    console.log(localStorage.getItem('token'));
  };
  return(
  <nav>
    <ul className="nav-bar">
      <li onClick={() => setCurrentPage('home')}>Home</li>
      <li onClick={() => setCurrentPage('search')}>Search Matches</li>
      <li onClick={() => setCurrentPage('about')}>About</li>

      {  (!localStorage.getItem('token'))  ?
       <li className="login-button" onClick={() => setCurrentPage('login') }>Login <LoginIcon/> </li> :
        <li className="account-button">
          <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
      <PersonIcon />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => setCurrentPage('userinfo')}>User Info</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item onClick={ () => handleLogout()  }>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
            </li> }


    </ul>
    <style>{`
      .nav-bar {
        align-items: center;
        display: flex;
        background-color: #333;
        padding: 1rem;
        list-style: none;
        color: white;
      }
      .nav-bar li {
        cursor: pointer;
        color: white;
        padding: 0.5rem 1rem;
      }
      .nav-bar li:hover {
        background-color: #575757;
        border-radius: 5px;
      }
      .nav-bar .login-button {
        margin-left:auto;
        background-color: #4CAF50; /* Green background for the login button */
        border-radius: 5px;
      }
      .nav-bar .login-button:hover {
        background-color: #45a049; /* Darker green when hovering */
      }
      .page-content {
        padding: 2rem;
      }
      .nav-bar .account-button
      {
        margin-left: auto;
      }
    `}</style>
  </nav>
);}

const HomePage = () => (
  <div>
    <h1>Welcome to Match Predictor</h1>
    <p>Use this app to search for and predict outcomes of matches.</p>
  </div>
);



const AboutPage = () => (
  <div>
    <h1>About</h1>
    <p>This project is designed to help users search and predict match outcomes using modern web technologies.</p>
  </div>
);

const NotFoundPage = () => (
  <div>
    <h1>404 - Page Not Found</h1>
    <p>Sorry, the page you're looking for doesn't exist.</p>
  </div>
);

const UserInfoPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user)
  {
    return (
      <div>
        <h1>Can't get user info.</h1>
      </div>
    )
  }
  else 
  {
    return (
      <div class="user-info">
      <h2>User Information</h2>
      <p><strong>Name:</strong> {user.email}</p>
      <p><strong>Email:</strong> {user.displayName} </p>
      
    </div>
    )
  }
}

export default App;
