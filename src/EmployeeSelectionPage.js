import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './EmployeeSelectionPage.css';

const EmployeeSelectionPage = () => {
  const [employees, setEmployees] = useState([]);
  const [reservationDetails, setReservationDetails] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve reservation details from local storage
    const storedDetails = localStorage.getItem('reservationDetails');
    if (storedDetails) {
      setReservationDetails(JSON.parse(storedDetails));
    } else {
      navigate('/user-reservation'); // Redirect if no reservation details found
    }
  }, [navigate]);

  useEffect(() => {
    if (reservationDetails.service && reservationDetails.branch) {
      // Fetch employees based on reservation details
      fetch('https://vynceianoani.helioho.st/fetchEmployeesByService.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: reservationDetails.service,
          branch: reservationDetails.branch
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            setEmployees(data.employees);
          } else {
            setError(data.message);
          }
        })
        .catch(error => {
          console.error('Error fetching employees:', error);
          setError('Failed to fetch employees.');
        });
    }
  }, [reservationDetails]);

  const handleSelectEmployee = () => {
    if (!selectedEmployee) {
      setError('Please select an employee.');
      return;
    }

    // Add selected employee to reservation details
    const updatedReservationDetails = {
      ...reservationDetails,
      employee: selectedEmployee
    };

    // Store updated reservation details in local storage
    localStorage.setItem('reservationDetails', JSON.stringify(updatedReservationDetails));

    // Navigate to the final reservation page
    navigate('/final-reservation', {
      state: updatedReservationDetails
    });
  };

  return (
    <div className="employee-selection-container">
      <Header />
      <div className="selection-box">
        <h2>Select an Employee</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {pending && <div className="pending-message">Loading...</div>}
        <div className="employee-list">
          {employees.map(employee => (
            <div key={employee.id} className="employee-item">
              <input
                type="radio"
                id={`employee-${employee.id}`}
                name="employee"
                value={employee.id}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              />
              <label htmlFor={`employee-${employee.id}`} className="employee-label">
                <img src={employee.profile_image_url} alt={employee.fullName} className="employee-image" />
                <span>{employee.fullName}</span>
              </label>
            </div>
          ))}
        </div>
        <div className='sample'>
        <button onClick={handleSelectEmployee} disabled={pending}>
          {pending ? 'Processing...' : 'Select Employee'}
        </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSelectionPage;
