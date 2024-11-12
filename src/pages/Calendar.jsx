import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '30px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
};

const buttonStyles = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '15px',
};

const cancelButtonStyles = {
  backgroundColor: '#f44336',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '15px',
};

function Calendar() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', description: '' });
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('user'));
    if (token && userData) {
      setUser(userData);
    } else {
      alert('User not authenticated');
    }
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetch(`/api/calendar/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      })
        .then(response => {
          setLoading(false);
          if (!response.ok) {
            throw new Error('Failed to fetch events');
          }
          return response.json();
        })
        .then(data => {
          // Map events to display blue dot with title
          const mappedEvents = data.map(event => ({
            title: `🔵 ${event.eventTitle}`,
            start: event.startTime,
            end: event.endTime,
            description: event.description,
          }));
          setEvents(mappedEvents);
        })
        .catch(error => {
          setLoading(false);
          setError(error.message);
          console.error('Error fetching events:', error);
        });
    }
  }, [user]);

  const handleDateClick = (arg) => {
    const dateStr = arg.dateStr + 'T00:00';
    setNewEvent({ ...newEvent, start: dateStr, end: dateStr });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert('Please fill out all event details!');
      return;
    }

    const startDate = new Date(newEvent.start);
    const endDate = new Date(newEvent.end);
    if (startDate >= endDate) {
      alert('End time must be later than start time.');
      return;
    }

    const token = localStorage.getItem('authToken');
    fetch('http://localhost:8080/api/calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: { id: user.id },
        eventTitle: newEvent.title,
        startTime: newEvent.start,
        endTime: newEvent.end,
        description: newEvent.description,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add event');
        }
        return response.json();
      })
      .then((data) => {
        // Update events with new event displaying blue dot and title
        setEvents([
          ...events,
          {
            title: `🔵 ${data.eventTitle}`,
            start: data.startTime,
            end: data.endTime,
            description: data.description,
          },
        ]);
        setNewEvent({ title: '', start: '', end: '', description: '' });
        setIsModalOpen(false);
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error adding event:', error);
        alert('Failed to add event.');
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewEvent({ title: '', start: '', end: '', description: '' });
  };

  return (
    <div className="calendar-container" style={{ margin: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>My FullCalendar</h1>
      {error && <div style={{ color: 'red', textAlign: 'center', margin: '10px' }}>{error}</div>}
      {loading && <div style={{ textAlign: 'center' }}>Loading events...</div>}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Add Event Modal"
        appElement={document.getElementById('root')}
      >
        <h2 style={{ textAlign: 'center' }}>Add Event</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              placeholder="Event title"
              style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
            />
          </div>
          <div>
            <label>Start Time:</label>
            <input
              type="datetime-local"
              name="start"
              value={newEvent.start}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
            />
          </div>
          <div>
            <label>End Time:</label>
            <input
              type="datetime-local"
              name="end"
              value={newEvent.end}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              placeholder="Event description"
              style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
            />
          </div>
          <button type="submit" style={buttonStyles}>Add Event</button>
          <button type="button" onClick={closeModal} style={cancelButtonStyles}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
}

export default Calendar;
