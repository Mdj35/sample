const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000; // You can change the port if needed

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow all origins (for development)

// Simulate a reservation endpoint
app.post('/reserve.php', (req, res) => {
  const { email, service, branch, date, time, employee, price } = req.body;

  // Basic validation (optional)
  if (!email || !service || !branch || !date || !time || !employee || !price) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  // Simulating a successful reservation (replace with real DB logic)
  console.log('Reservation received:', req.body);

  // Simulating a success response
  return res.status(200).json({ status: 'success', message: 'Reservation confirmed' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
