import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  // Form validation logic
  const validateForm = () => {
    let valid = true;

    // Validate username
    if (!username || username.length < 4) {
      setUsernameError('Please enter a valid username');
      valid = false;
    } else {
      setUsernameError('');
    }

    // Validate password
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  // Handling login functionality
  const onButtonClick = async () => {
    setGeneralError('');  // Reset any previous errors
  
    if (!validateForm()) return;  // Validate form inputs
    
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();  // Parse the JSON response
      console.log(data);

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        console.log(localStorage);

  
        // Redirect to calendar or another protected route
        navigate('/dashboard');
      } else {
        setGeneralError(data.error || 'Login failed');
      }
    } catch (error) {
      setGeneralError('Something went wrong, please try again');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4" style={{ width: '400px' }}>
        <div className="card-title text-center mb-4">
          <h2>Login</h2>
        </div>

        {/* General error message */}
        {generalError && <div className="alert alert-danger">{generalError}</div>}

        <div className="form-container">
          <div className="mb-3">
            <input
              type="text"
              value={username}
              placeholder="Enter your username"
              onChange={(ev) => setUsername(ev.target.value)}
              className={`form-control ${usernameError ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{usernameError}</div>
          </div>

          <div className="mb-3">
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(ev) => setPassword(ev.target.value)}
              className={`form-control ${passwordError ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{passwordError}</div>
          </div>

          <div className="text-center">
            <button className="btn btn-primary w-100" onClick={onButtonClick}>
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
