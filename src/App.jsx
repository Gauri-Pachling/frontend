import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import MeetingRoom from './pages/MeetingRoom';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import AddReminder from './pages/AddReminder';

const AppContent = () => {
  const location = useLocation();

  return (
    <div>
      {/* Only render Navbar if the current path is not the login page */}
      {location.pathname !== '/' && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/meetings" element={<MeetingRoom />} />
        <Route path="/reminder" element={<AddReminder />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
