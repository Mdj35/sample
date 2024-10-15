import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './UserPage.css';

const UserReservationPage = () => {
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState([]); // To hold selected service types
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]); // To hold multiple selected services
  const [selectedBranch, setSelectedBranch] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState(null);
  const [servicePrices, setServicePrices] = useState([]); // Store multiple service prices
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

  // Filter services by selected service types
  useEffect(() => {
    if (selectedServiceTypes.length > 0) {
      const filtered = services.filter(service => selectedServiceTypes.includes(service.type));
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  }, [selectedServiceTypes, services]);

  // Generate available times based on service selections
  useEffect(() => {
    const times = [];
    const startHour = 9; // 9 AM
    const endHour = 19; // 7 PM (19:00)
    const totalHours = selectedServices.length; // Each service adds 1 hour

    for (let hour = startHour; hour + totalHours <= endHour; hour++) {
      const timeString = `${hour}:00-${hour + totalHours}:00`;
      times.push(timeString);
    }

    setAvailableTimes(times);
  }, [selectedServices]);

  // Handle service type selection using checkboxes
  const handleServiceTypeChange = (event) => {
    const serviceType = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedServiceTypes((prevSelectedTypes) => [...prevSelectedTypes, serviceType]);
    } else {
      setSelectedServiceTypes((prevSelectedTypes) =>
        prevSelectedTypes.filter((type) => type !== serviceType)
      );
    }
  };

  // Handle service selection using checkboxes
  const handleServiceChange = (event) => {
    const serviceName = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked && selectedServices.length < 5) {
      // Add the selected service
      setSelectedServices((prevSelectedServices) => [...prevSelectedServices, serviceName]);

      const selectedService = filteredServices.find(service => service.name === serviceName);
      if (selectedService) {
        setServicePrices((prevPrices) => [...prevPrices, selectedService.price]);
      }
    } else if (!isChecked) {
      // Remove the deselected service
      setSelectedServices((prevSelectedServices) =>
        prevSelectedServices.filter((service) => service !== serviceName)
      );

      const selectedService = filteredServices.find(service => service.name === serviceName);
      if (selectedService) {
        setServicePrices((prevPrices) =>
          prevPrices.filter((price) => price !== selectedService.price)
        );
      }
    } else {
      setError('You can select a maximum of 5 services.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedServices.length === 0 || !date || !time || !selectedBranch) {
      setError('Please fill out all fields.');
      return;
    }

    const totalPrice = servicePrices.reduce((sum, price) => sum + parseFloat(price), 0);

    // Save reservation details in local storage, including the email
    localStorage.setItem('reservationDetails', JSON.stringify({
      services: selectedServices,
      branch: selectedBranch,
      date,
      time,
      price: totalPrice,
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
            <label>Service Type</label>
            <div className="service-type-checkbox-group">
              {['Nails', 'Lash and Brow', 'Waxing', 'Hair and Make-up'].map((type) => (
                <div key={type} className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id={type}
                    value={type}
                    onChange={handleServiceTypeChange}
                  />
                  <label htmlFor={type}>{type}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Service</label>
            <div className="service-checkbox-group">
              {filteredServices.map((service) => (
                <div key={service.id} className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id={service.name}
                    value={service.name}
                    onChange={handleServiceChange}
                    disabled={selectedServices.length >= 5 && !selectedServices.includes(service.name)} // Disable other checkboxes when 5 services are selected
                  />
                  <label htmlFor={service.name}>
                    {service.name} - ₱{service.price}
                  </label>
                </div>
              ))}
            </div>
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
