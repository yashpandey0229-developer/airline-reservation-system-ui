import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. IMPORT KAREIN

function BookingPage() {
  const { flightId } = useParams();
  const [flight, setFlight] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [seats, setSeats] = useState(1);
  const [bookingStatus, setBookingStatus] = useState('');
  const { token } = useAuth(); // 2. TOKEN KO LEIN

  useEffect(() => {
    // GET requests public hain, inhein token ki zaroorat nahi hai
    Promise.all([
      fetch(`http://localhost:8081/flights/${flightId}`),
      fetch(`http://localhost:8081/customers/all`) // Yeh bhi protected hai, hum isey agle step mein fix karenge
    ])
    .then(([flightRes, customersRes]) => 
      Promise.all([flightRes.json(), customersRes.json()])
    )
    .then(([flightData, customersData]) => {
      setFlight(flightData);
      setCustomers(customersData);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [flightId]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setBookingStatus('Please select a customer.');
      return;
    }
    setBookingStatus('Processing...');
    
    const url = `http://localhost:8081/bookings/create?flightId=${flightId}&customerId=${selectedCustomer}&seats=${seats}`;

    // --- YEH HAI ASLI FIX ---
    fetch(url, { 
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}` // 3. TOKEN KO HEADER MEIN BHEJEIN
        }
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(bookingConfirmation => {
        setBookingStatus(`Booking confirmed! Your Booking ID is ${bookingConfirmation.bookingId}`);
      })
      .catch(error => {
        setBookingStatus(`Booking failed: ${error.message}`);
      });
  };

  if (!flight) {
    return <div>Loading...</div>;
  }

  return (
    <div className="booking-page">
      {/* ... Aapka baaki ka JSX (flight details, form) waisa hi rahega ... */}
      <h1>Book a Flight</h1>
      <div className="flight-card">
        <h2>{flight.flightNumber}</h2>
        <p>{flight.departureAirport} to {flight.arrivalAirport}</p>
        <p>Price per seat: ₹{flight.price}</p>
      </div>
      <form onSubmit={handleBooking} className="booking-form">
        <h3>Confirm Your Booking</h3>
        <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} required>
          <option value="" disabled>Select a Customer</option>
          {customers.map(customer => (
            <option key={customer.customerId} value={customer.customerId}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </select>
        <input type="number" min="1" value={seats} onChange={(e) => setSeats(e.target.value)} placeholder="Number of Seats" required />
        <button type="submit">Confirm Booking</button>
      </form>
      {bookingStatus && <p className="booking-status">{bookingStatus}</p>}
    </div>
  );
}

export default BookingPage;