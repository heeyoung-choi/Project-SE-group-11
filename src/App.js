import React, { useState } from 'react';

import SearchMatchesPage from './SearchMatchesPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <SearchMatchesPage />;
      case 'about':
        return <AboutPage />;
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
const handleClick = async () => 
{
  let username = "huydang";
  let password = "123";
  try {
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Set the content type to JSON
      },
      body: JSON.stringify({ username, password }),  // Convert the object to a JSON string
    });

    if (!response.ok) {
      // Handle non-200 responses
      const errorData = await response.json();
      console.log(errorData)
    }

    const data = await response.json();  // Parse the JSON response
    console.log('Login successful:', data);  // Handle success (e.g., save token, navigate)
  } catch (error) {
    console.error('Error during login:', error);
    // Handle error (e.g., show error message to user)
  }
}
const Navigation = ({ setCurrentPage }) => (
  <nav>
    <ul className="nav-bar">
      <li onClick={() => setCurrentPage('home')}>Home</li>
      <li onClick={() => setCurrentPage('search')}>Search Matches</li>
      <li onClick={() => setCurrentPage('about')}>About</li>
      <li className="login-button" onClick={handleClick}>Login</li> {/* Login button */}
    </ul>
    <style>{`
      .nav-bar {
        display: flex;
        justify-content: space-between; /* Adjust for login button */
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
        background-color: #4CAF50; /* Green background for the login button */
        border-radius: 5px;
      }
      .nav-bar .login-button:hover {
        background-color: #45a049; /* Darker green when hovering */
      }
      .page-content {
        padding: 2rem;
      }
    `}</style>
  </nav>
);

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

export default App;
