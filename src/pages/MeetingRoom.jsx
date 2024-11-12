import React, { useEffect } from 'react';

const MeetingRoom = () => {
  useEffect(() => {
    // Open a new tab or window for localhost:3000
    window.open('http://localhost:3000', '_blank');
  }, []);

  return (
    <div className="meeting-room-container">
      <h1>Opening Meeting Room in a new tab...</h1>
      <p>If it doesn't open automatically, click <a href="http://localhost:3000">here</a>.</p>
    </div>
  );
};

export default MeetingRoom;
