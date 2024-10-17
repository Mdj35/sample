import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './EmployeeSelectionPage.css';

const EmployeeSelectionPage = () => {
  const [employees, setEmployees] = useState({}); // Store employees grouped by service
  const [reservationDetails, setReservationDetails] = useState({}); // Store reservation details
  const [selectedEmployees, setSelectedEmployees] = useState({}); // For multiple employee selections
  const [error, setError] = useState(''); // Error message state
  const [success, setSuccess] = useState(''); // Success message state
  const [pending, setPending] = useState(false); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
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
    if (reservationDetails.services && reservationDetails.branch) {
      // Fetch employees based on reservation details
      fetch('https://vynceianoani.helioho.st/fetchEmployeesByService.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          services: reservationDetails.services, // Send multiple services
          branch: reservationDetails.branch,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            setEmployees(data.employees); // Set employees grouped by service
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

  // Handle selecting/deselecting employees for services
  const handleSelectEmployee = (event, serviceName) => {
    const employeeId = event.target.value; // Get the selected employee ID
    const isChecked = event.target.checked; // Get the checkbox state

    setSelectedEmployees((prevSelectedEmployees) => {
      const updatedEmployees = { ...prevSelectedEmployees };

      if (isChecked) {
        // Limit to only one employee per service
        updatedEmployees[serviceName] = [employeeId]; // Replace with the new employee
      } else {
        // Deselect employee
        updatedEmployees[serviceName] = updatedEmployees[serviceName].filter(
          (id) => id !== employeeId
        );
      }

      return updatedEmployees;
    });
  };

  const handleSubmit = () => {
    const errors = reservationDetails.services.some(service => {
      return !selectedEmployees[service] || selectedEmployees[service].length === 0;
    });

    if (errors) {
      setError('Please select at least one employee for each service.');
      return;
    }

    const updatedReservationDetails = {
      ...reservationDetails,
      employees: selectedEmployees, // Store selected employees
    };

    localStorage.setItem('reservationDetails', JSON.stringify(updatedReservationDetails));

    // Trigger normal submit process
    navigate('/final-reservation', {
      state: updatedReservationDetails,
    });
  };

  const handlePayNow = () => {
    setIsModalOpen(false); // Close the modal
    handleSubmit(); // Trigger the normal submit function
  };

  const handlePayLater = () => {
    setIsModalOpen(false);
    setPending(true);
  
    // Prepare the data to send to the server
    const data = {
      services: reservationDetails.services,
      date: reservationDetails.date,
      time: reservationDetails.time,
      email: reservationDetails.email,
      employees: selectedEmployees,
      price: reservationDetails.price,
      branch: reservationDetails.branch,
    };
  
    // Call the API to create reservation and billing
    fetch('https://vynceianoani.helioho.st/billing.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        setPending(false);
        if (result.status === 'success') {
          setSuccess('Reservation created successfully with Pay Later option!');
          navigate('/userpage', { state: { reservationId: result.reservation_id } });
        } else {
          setError(result.message || 'Failed to create reservation. Please try again.');
        }
      })
      .catch((error) => {
        setPending(false);
        setError('Failed to create reservation. Please try again later.');
        console.error('Error:', error);
      });
  };
  
  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div className="employee-selection-container">
      <Header />
      <div className="selection-box">
        <h2>Select Employees</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {pending && <div className="pending-message">Loading...</div>}
        <div className="employee-list">
          {reservationDetails.services &&
            reservationDetails.services.map((service) => (
              <div key={service} className="service-group">
                <h3>Select employees for {service}</h3>
                {employees[service] && employees[service].length > 0 ? (
                  employees[service].map((employee) => (
                    <div key={employee.id} className="employee-item">
                      <input
                        type="checkbox"
                        id={`employee-${employee.id}-${service}`}
                        value={employee.id} // Set value to employee ID
                        onChange={(e) => handleSelectEmployee(e, service)}
                        checked={selectedEmployees[service]?.includes(employee.id) || false}
                        disabled={selectedEmployees[service]?.length > 0 && !selectedEmployees[service]?.includes(employee.id)}
                      />
                      <label htmlFor={`employee-${employee.id}-${service}`} className="employee-label">
                        <img src={employee.profile_image_url} alt={employee.fullName} className="employee-image" />
                        <span>{employee.fullName}</span>
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No employees available for {service}</p>
                )}
              </div>
            ))}
        </div>
        <button onClick={openModal} disabled={pending}>
          {pending ? 'Processing...' : 'Submit'}
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>

            <h3>Choose Payment Option</h3>
            <button onClick={handlePayNow}>Pay Now</button>
            <button onClick={handlePayLater}>Pay Later</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSelectionPage;
