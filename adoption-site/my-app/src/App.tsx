import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import AvailableAnimalsPage from './AvailableAnimals';
import HappyStoriesPage from './HappyStories';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const handleLogin = () => {
    setIsLoggedIn(true); 
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} /> 
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <div className="loginButtonContainer">
                <button className="loginButton" onClick={handleLogin}>
                  Login as administrator
                </button>
              </div>
            ) : (
              <Navigate to="/available-animals" /> 
            )
          }
        />
        <Route
          path="/available-animals"
          element={isLoggedIn ? <AvailableAnimalsPage /> : <Navigate to="/" />} 
        /> 
        <Route
          path="/about"
          element={<HappyStoriesPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;