import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import './FinalReservation.css';

// Load PayPal SDK
const loadPayPalScript = (callback) => {
  const script = document.createElement('script');
  script.src = 'https://www.paypal.com/sdk/js?client-id=ASKmv9SI7KJMNK3yafnnS5xEG-BgdxBaTHuUmU9UXtSJ5VjoyaICL9Nqre4vewdy-q5uf5Lin_lC27Yl'; // Replace with your PayPal client ID
  script.onload = () => callback();
  document.body.appendChild(script);
};

const FinalizeReservationPage = () => {
  const [reservationDetails, setReservationDetails] = useState({});
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [isPaid, setIsPaid] = useState(false); // Track payment status
  const [reservationId, setReservationId] = useState(null); // Track reservation ID
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

    // Load PayPal script when component mounts
    loadPayPalScript(() => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: reservationDetails.price ? reservationDetails.price.toFixed(2) : '0.00',
              },
            }],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(details => {
            setIsPaid(true);
            // Save payment details to the backend
            savePaymentToDatabase(); // This function handles saving payment info and reservation
          });
        },
        onError: (err) => {
          setError('Payment failed. Please try again.');
          setPending(false);
        }
      }).render('#paypal-button-container'); // Render PayPal button in the container
    });
  }, [location, navigate, reservationDetails.price]);

  // Function to create reservation (called once)
  // Inside the createReservation function in FinalizeReservationPage component
const createReservation = (details) => {
  if (reservationId) return; // If reservation is already created, do nothing

  setPending(true);

  const reservationData = {
    ...details,
    status: 'pending', // Add the status field to the request
  };

  fetch('https://vynceianoani.helioho.st/reserve.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservationData), // Send reservation data with status
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success' && data.reservation_id) {
        console.log('Reservation successful with ID:', data.reservation_id);
        setReservationId(data.reservation_id); // Store the reservation ID
        setPending(false);
      } else {
        setPending(false);
        setError(data.message || 'Failed to create reservation.');
      }
    })
    .catch(error => {
      console.error('Error creating reservation:', error);
      setPending(false);
      setError('Failed to create reservation.');
    });
};


  // Function to save payment details to the backend (after PayPal confirms payment)
  const savePaymentToDatabase = () => {
    if (!reservationId) {
      // Only create a reservation if it hasn't been created yet
      createReservation(reservationDetails); 
    }

    const paymentData = {
      email: reservationDetails.email, // Send the email instead of customer_id
      reservation_id: reservationId, // Use the generated reservation ID
      date_of_payment: new Date().toISOString(), // Current date
      type_of_payment: 'PayPal', // Default PayPal
      payment_confirmation: 'success' // Default success
    };

    fetch('https://vynceianoani.helioho.st/save-payment.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          navigate('/userpage'); // Redirect to a success page after payment
        } else {
          setError('Failed to save payment information.');
          setPending(false);
        }
      })
      .catch(error => {
        console.error('Error saving payment information:', error);
        setError('Failed to save payment information.');
        setPending(false);
      });
  };

  return (
    <div>
      <Header />
      <div className="finalize-reservation-container">
        <div className="reservation-summary-box">
          <h2>Finalize Your Reservation</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="reservation-details">
            <p><strong>Email:</strong> {reservationDetails.email}</p>
            <p><strong>Branch:</strong> {reservationDetails.branch}</p>
            <p><strong>Date:</strong> {reservationDetails.date}</p>
            <p><strong>Time:</strong> {reservationDetails.time}</p>
            <p><strong>Price:</strong> {reservationDetails.price ? reservationDetails.price.toFixed(2) : 'N/A'}</p>

            {/* Map through services and display selected employees */}
            {reservationDetails.services && reservationDetails.services.map((service, index) => (
              <div key={index}>
                <p><strong>Service {index + 1}:</strong> {service}</p>
                <p>
                  <strong>Employee:</strong> 
                  {reservationDetails.employees && reservationDetails.employees[service] 
                    ? reservationDetails.employees[service][0] // Display the selected employee for this service
                    : 'N/A'}
                </p>
              </div>
            ))}
          </div>

          {/* PayPal Button */}
          <div id="paypal-button-container"></div>

          <div className="sample-button">
            <button onClick={savePaymentToDatabase} disabled={pending || !isPaid}>
              {pending ? 'Processing...' : isPaid ? 'Confirm Reservation' : 'Complete Payment First'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalizeReservationPage;
