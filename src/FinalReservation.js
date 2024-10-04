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
          // After successful reservation, initiate payment
          adyen_payment();
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

  function adyen_payment() {
    
    // Adyen Node API Library v17.3.0
    const { Client, Config, CheckoutAPI } = require('@adyen/api-library');
    const config = new Config();
    config.apiKey = "AQEphmfuXNWTK0Qc+iSTmm07lPCaXIJCA8EaATwaBqqIRXtqP/+nRaF4A9YQwV1bDb7kfNy1WIxIIkxgBw==-U8PLMMnRmNHQVCGHXHT6fK/undY8MW3MwUJumdrYnGY=-i1i(y39D)N}#FcdEBBt";
    config.merchantAccount = 'ChicStation209ECOM';
    
    const client = new Client({ config });
    client.setEnvironment("TEST");
    const checkout = new CheckoutAPI(client);
    
    // Create payment request object
    checkout.PaymentsApi.payments({
      amount: {
        value: reservationDetails.price * 100, // Convert PHP to cents
        currency: "PHP"
      },
      paymentMethod: {
        type: "scheme",
        "encryptedCardNumber": "test_5555555555554444",
        "encryptedExpiryMonth": "test_03",
        "encryptedExpiryYear": "test_2030",
        "encryptedSecurityCode": "test_737",
        holderName: "John Smith"
      },
      reference: reservationDetails.email ,
      shopperInteraction: "Ecommerce",
      recurringProcessingModel: "CardOnFile",
      storePaymentMethod: "true",
      merchantAccount: config.merchantAccount,
      shopperReference: "YOUR_SHOPPER_REFERENCE",
      returnUrl: "https://your-company.com/..."
    })
    .then(res => {
      console.log(res);
      setPending(false);
      navigate('/userpage'); // Redirect on successful payment
    })
    .catch(res => {
      console.log(res);
      setPending(false);
      setError('Payment failed.');
    });
  }

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
