import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './AdminHeader';
import './AdminPage.css';

const AdminReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve admin email from local storage
    const adminEmail = localStorage.getItem('userEmail');
    if (!adminEmail || !adminEmail.includes('@chicstation')) {
      navigate('/login'); // Redirect to login if not an admin
      return;
    }
  
    // Fetch reservations for the logged-in admin/employee
    fetch('https://vynceianoani.helioho.st/getReservations.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminEmail }), // Pass the admin's email
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setReservations(data.reservations); // Set the reservations
        } else {
          setError('Failed to load reservations.');
        }
      })
      .catch(error => {
        console.error('Error fetching reservations:', error);
        setError('Failed to load reservations.');
      });
  }, [navigate]);
  

  const updateStatus = async (reservationId, newStatus) => {
    try {
      const response = await fetch('https://vynceianoani.helioho.st/updateReservations.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: reservationId, status: newStatus }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Reservation status updated successfully!');
        setError('');
        // Refresh reservations
        setReservations(prevReservations =>
          prevReservations.map(reservation =>
            reservation.id === reservationId
              ? { ...reservation, status: newStatus }
              : reservation
          )
        );
      } else {
        setError(result.message);
        setSuccess('');
      }
    } catch (error) {
      setError('An error occurred while updating the reservation status.');
      setSuccess('');
    }
  };

  return (
    <div>
      <Header />
    <div className="admin-reservation-container">
      
      <div className="admin-box">
        <h2>Admin: Manage Reservations</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <table className="reservation-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
<tbody>
  {reservations.map(reservation => (
    <tr key={reservation.id}>
      <td>{reservation.user_email}</td>
      <td>{reservation.service}</td>
      <td>{reservation.date}</td>
      <td>{reservation.time}</td>
      <td>₱{reservation.price}</td>
      <td>{reservation.status}</td>
      <td>
        {reservation.status !== 'approved' && reservation.status !== 'rejected' && reservation.status !== 'completed' ? (
          <>
            <button onClick={() => updateStatus(reservation.id, 'approved')}>
              Approve
            </button>
            <button onClick={() => updateStatus(reservation.id, 'rejected')}>
              Reject
            </button>
          </>
        ) : (
          <span>No actions available</span>
        )}
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
    </div>
  );
};

export default AdminReservationPage;
