import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1e2f91' }}>
      <div className="container-fluid">
        {/* Logo */}
        <div className="navbar-brand"><Link to="/dashboard" className="nav-link">MyWorkspace</Link></div>


        {/* Navbar links aligned to the right */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto">
            <Link to="/calendar" className="nav-link">Calendar</Link>
            <Link to="/meetings" className="nav-link">Meetings</Link>
            <Link to="/reminder" className="nav-link">Add Reminders</Link>
            <Link to="/" className="nav-link">Logout</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
