import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './UserPage.css';

const UserReservationPage = () => {
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState(null);
  const [servicePrice, setServicePrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch services from the backend
    fetch('https://vynceianoani.helioho.st/services.php')
      .then(response => response.json())
      .then(data => setServices(data.services))
      .catch(error => console.error('Error fetching services:', error));

    // Fetch branches from the backend
    fetch('https://vynceianoani.helioho.st/branches.php')
      .then(response => response.json())
      .then(data => setBranches(data.branches))
      .catch(error => console.error('Error fetching branches:', error));

    // Retrieve email from local storage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setEmail(userEmail);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Store email in local storage whenever it is updated
  useEffect(() => {
    if (email) {
      localStorage.setItem('userEmail', email);
    }
  }, [email]);

  // Filter services by selected service type
  useEffect(() => {
    if (selectedServiceType) {
      const filtered = services.filter(service => service.type === selectedServiceType);
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  }, [selectedServiceType, services]);

  // Generate available times based on service type
  useEffect(() => {
    const times = [];
    const startHour = 9; // 9 AM
    const endHour = 19; // 7 PM (19:00)

    const interval = selectedServiceType === 'Nails' ? 2 : 1; // 2 hours for 'Nails', 1 hour for other services

    for (let hour = startHour; hour < endHour; hour += interval) {
      const timeString = `${hour}:00-${hour + interval}:00`;
      times.push(timeString);
    }

    setAvailableTimes(times);
  }, [selectedServiceType]);

  const handleServiceTypeChange = (event) => {
    setSelectedServiceType(event.target.value);
    setSelectedService(''); // Reset service selection when service type changes
  };

  const handleServiceChange = (event) => {
    const selectedService = event.target.value;
    const service = filteredServices.find(service => service.name === selectedService);
    setSelectedService(selectedService);
    setServicePrice(service ? service.price : null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedService || !date || !time || !selectedBranch) {
      setError('Please fill out all fields.');
      return;
    }

    // Save reservation details in local storage, including the email
    localStorage.setItem('reservationDetails', JSON.stringify({
      service: selectedService,
      branch: selectedBranch,
      date,
      time,
      price: servicePrice,
      email: email
    }));

    // Navigate to employee selection page
    navigate('/employee-selection');
  };

  return (
    <div className="user-reservation-container">
      <Header />
      <div className="reservation-box">
        <h2>Reserve a Service</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {pending && <div className="pending-message">Reservation in progress...</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="serviceType">Service Type</label>
            <select
              id="serviceType"
              value={selectedServiceType}
              onChange={handleServiceTypeChange}
              disabled={pending}
            >
              <option value="">Select a service type</option>
              <option value="Nails">Nails</option>
              <option value="Lash and Brow">Lash and Brow</option>
              <option value="Waxing">Waxing</option>
              <option value="Hair and Make-up">Hair and Make-up</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="service">Service</label>
            <select
              id="service"
              value={selectedService}
              onChange={handleServiceChange}
              disabled={pending || !selectedServiceType}
            >
              <option value="">Select a service</option>
              {filteredServices.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name} - ₱{service.price}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="branch">Branch</label>
            <select
              id="branch"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              disabled={pending}
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} - {branch.address}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={pending}
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              disabled={pending}
            >
              <option value="">Select a time</option>
              {availableTimes.map((timeSlot) => (
                <option key={timeSlot} value={timeSlot}>
                  {timeSlot}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="reserve-button" disabled={pending}>
            {pending ? 'Proceeding...' : 'Proceed'}
          </button>   
        </form>
      </div>
    </div>
  );
};

export default UserReservationPage;
