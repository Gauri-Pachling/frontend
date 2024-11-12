import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username); 
    } else {
      alert('User not authenticated');
    }
  }, []);

  return (
    <div className="container mt-5">
      {/* Heading */}
      <div className="text-center mb-4">
        <h1 className="display-4 text-primary">Dashboard</h1>
        <p className="lead text-muted">Welcome to your collaborative workspace dashboard!</p>
        {username && <p className="text-muted">Hello, <strong>{username}</strong>!</p>}
      </div>

      {/* Project Info Section */}
      <div className="row">
        {/* Section for Project Overview */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="card-title">Project Overview</h4>
            </div>
            <div className="card-body">
              <p>
                This project is a collaborative workspace platform designed to facilitate seamless communication,
                scheduling, and document collaboration for teams. It integrates features like virtual meeting rooms,
                real-time chat, and calendar integration to provide a one-stop solution for efficient teamwork.
              </p>
              <ul>
                <li><strong>Real-time collaboration</strong> with chat.</li>
                <li><strong>Meeting Rooms</strong> for video conferencing.</li>
                <li><strong>Calendar</strong> to schedule and manage events.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section for Features */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h4 className="card-title">Key Features</h4>
            </div>
            <div className="card-body">
              <h5>1. User Authentication</h5>
              <p>Secure user login with authentication for safe access to your workspace.</p>

              <h5>2. Virtual Meeting Rooms</h5>
              <p>Instant meetings with integrated video and chat features for remote collaboration.</p>

              <h5>3. Calendar Integration</h5>
              <p>Manage meetings and events with the integrated calendar system.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Status Section */}
      <div className="row">
        <div className="col-12">
          <div className="alert alert-info text-center">
            <h4>Project Status: <span className="badge bg-success">Active</span></h4>
            <p>This project is currently live and being continuously improved. Stay tuned for updates!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
