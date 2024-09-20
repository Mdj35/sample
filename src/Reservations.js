import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reservations.css';
import Header from './Header';

const UserReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [email, setEmail] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve email from local storage
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      navigate('/login'); // Redirect to login if email is not found
      return;
    }
    setEmail(userEmail);

    // Fetch reservations from the backend
    fetch('https://vynceianoani.helioho.st/reservations.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail }),
    })
      .then(response => response.json())
      .then(data => setReservations(data.reservations))
      .catch(error => {
        console.error('Error fetching reservations:', error);
        setError('An error occurred while fetching reservations.');
      });
  }, [navigate]);

  return (
    <div className="user-reservations-container">
      <Header />
      <div className="reservations-box">
        <h2>Your Reservations</h2>
        {error && <div className="error-message">{error}</div>}
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Price</th>
              <th>Date</th>
              <th>Time</th>
              <th>Employee</th>
              <th>Status</th>
              <th>Branch</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan="7">No reservations found.</td>
              </tr>
            ) : (
              reservations.map((reservation, index) => (
                <tr key={index}>
                  <td>{reservation.service}</td>
                  <td>{reservation.price}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.time}</td>
                  <td>{reservation.employee_name}</td>
                  <td>{reservation.status}</td>
                  <td>{reservation.branch_name}</td>
                  <td>{reservation.branch_address}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserReservationsPage;
