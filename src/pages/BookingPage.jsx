import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function BookingPage() {
  const { flightId } = useParams();
  const [flight, setFlight] = useState(null);
  const [customers, setCustomers] = useState([]); // <-- NEW: State to hold the list of customers
  const [selectedCustomer, setSelectedCustomer] = useState(''); // <-- NEW: State for the selected customer ID
  const [seats, setSeats] = useState(1);
  const [bookingStatus, setBookingStatus] = useState('');

  // This will now fetch both the flight details AND the list of all customers
  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8081/flights/${flightId}`),
      fetch(`http://localhost:8081/customers/all`)
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
    
    // Use the selectedCustomer state for the API call
    const url = `http://localhost:8081/bookings/create?flightId=${flightId}&customerId=${selectedCustomer}&seats=${seats}`;

    fetch(url, { method: 'POST' })
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
      <h1>Book a Flight</h1>
      <div className="flight-card">
        <h2>{flight.flightNumber}</h2>
        <p>{flight.departureAirport} to {flight.arrivalAirport}</p>
        <p>Price per seat: ₹{flight.price}</p>
      </div>

      <form onSubmit={handleBooking} className="booking-form">
        <h3>Confirm Your Booking</h3>
        
        {/* --- NEW: Replaced text input with a dropdown menu --- */}
        <select 
          value={selectedCustomer} 
          onChange={(e) => setSelectedCustomer(e.target.value)} 
          required
        >
          <option value="" disabled>Select a Customer</option>
          {customers.map(customer => (
            <option key={customer.customerId} value={customer.customerId}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </select>
        
        <input 
          type="number" 
          min="1" 
          value={seats} 
          onChange={(e) => setSeats(e.target.value)} 
          placeholder="Number of Seats" 
          required 
        />
        <button type="submit">Confirm Booking</button>
      </form>

      {bookingStatus && <p className="booking-status">{bookingStatus}</p>}
    </div>
  );
}

export default BookingPage;