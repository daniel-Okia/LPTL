import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Players from './pages/Players';
import Fixtures from './pages/Fixtures';
import Standings from './pages/Standings';
import Transfers from './pages/Transfers';
import Admin from './pages/Admin';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import PlayerProfile from './pages/PlayerProfile';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/players" element={<Players />} />
              <Route path="/fixtures" element={<Fixtures />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/transfers" element={<Transfers />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/player/:id" element={<PlayerProfile />} />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;