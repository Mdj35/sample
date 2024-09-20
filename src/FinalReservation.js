import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import './FinalReservation.css';

const FinalizeReservationPage = () => {
  const [reservationDetails, setReservationDetails] = useState({});
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Retrieve reservation details from location state
    const details = location.state;
    if (details) {
      setReservationDetails(details);
    } else {
      navigate('/userpage'); // Redirect if no reservation details found
    }
  }, [location, navigate]);

  const handleConfirmReservation = () => {
    setPending(true);

    fetch('https://vynceianoani.helioho.st/reserve.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationDetails),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setPending(false);
          navigate('/userpage'); // Redirect to a success page
        } else {
          setPending(false);
          setError(data.message);
        }
      })
      .catch(error => {
        console.error('Error confirming reservation:', error);
        setPending(false);
        setError('Failed to confirm reservation.');
      });
  };

  return (
    <div className="finalize-reservation-container">
      <Header />
      <div className="reservation-summary-box">
        <h2>Finalize Your Reservation</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="reservation-details">
          <p><strong>Email:</strong> {reservationDetails.email}</p>
          <p><strong>Service:</strong> {reservationDetails.service}</p>
          <p><strong>Branch:</strong> {reservationDetails.branch}</p>
          <p><strong>Date:</strong> {reservationDetails.date}</p>
          <p><strong>Time:</strong> {reservationDetails.time}</p>
          <p><strong>Employee:</strong> {reservationDetails.employee}</p>
          <p><strong>Price:</strong> {reservationDetails.price}</p>
        </div>
        <div className="sample-button">
        <button onClick={handleConfirmReservation} disabled={pending}>
          {pending ? 'Processing...' : 'Confirm Reservation'}
        </button>
        </div>
      </div>
    </div>
  );
};

export default FinalizeReservationPage;
