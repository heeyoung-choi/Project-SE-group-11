import React, { useState } from 'react';
import Example from './Example';
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

const Navigation = ({ setCurrentPage }) => (
  <nav>
    <ul className="nav-bar">
      <li onClick={() => setCurrentPage('home')}>Home</li>
      <li onClick={() => setCurrentPage('search')}>Search Matches</li>
      <li onClick={() => setCurrentPage('about')}>About</li>
    </ul>
    <style>{`
      .nav-bar {
        display: flex;
        justify-content: space-around;
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
