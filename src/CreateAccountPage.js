import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CreateAccountPage.css';

const CreateAccountPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    termsAccepted: false,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      termsAccepted: checked,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate password
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Validate terms acceptance
    if (!formData.termsAccepted) {
      setError('You must accept the terms and conditions.');
      return;
    }

    // Validate contact number
    const contactNumberPattern = /^(?:\+639|09)[0-9]{9,10}$/;
    if (!contactNumberPattern.test(formData.contactNumber)) {
      setError('Contact number must start with +639 or 09 and be followed by 9-10 digits.');
      return;
    }

    // Send data to the API
    fetch('http://vynceianoani.helioho.st/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setSuccessMessage('Account created successfully!');
          setError('');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(data.message || 'An error occurred while creating the account.');
          setSuccessMessage('');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('An error occurred while creating the account.');
        setSuccessMessage('');
      });
  };

  return (
    <div className="create-account-container1">
      <div className="create-account-box1">
        <h2>Create Your Account</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group1">
            <label htmlFor="full-name">Full Name</label>
            <input
              type="text"
              id="full-name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group1">
            <label htmlFor="contact-number">Contact Number</label>
            <input
              type="tel"
              id="contact-number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              required
              maxLength="14"
              pattern="(\+639|09)[0-9]{9,10}"
              title="Contact number must start with +639 or 09 and be followed by 9-10 digits."
            />
          </div>
          <div className="form-group1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="8"
              maxLength="16"
            />
          </div>
          <div className="form-group1">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              minLength="8"
              maxLength="16"
            />
          </div>
          <div className="terms-conditions">
            <input
              type="checkbox"
              id="terms-conditions"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="terms-conditions">
              I accept the <Link to="/terms">terms and conditions</Link>.
            </label>
          </div>
          <button type="submit" className="create-account-button">Create Account</button>
        </form>
        <Link to="/login" className="back-to-login-button">Back to Login</Link>
      </div>
    </div>
  );
};

export default CreateAccountPage;
