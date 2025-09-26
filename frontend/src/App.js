import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AddPersonPage from './pages/AddPersonPage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App () {
  return (
    <Router>
      <div className="app-container">
        <Navigation />

        <main className="main-content">
          <Routes>
            <Route path="/" element={ <HomePage /> } />
            <Route path="/add" element={ <AddPersonPage /> } />
            <Route path="/map" element={ <MapPage /> } />
            <Route path="/dashboard" element={ <DashboardPage /> } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
