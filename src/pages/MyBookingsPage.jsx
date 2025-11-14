import { useState, useEffect } from 'react';
import '../App.css';

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = () => {
    fetch('http://localhost:8081/bookings/all')
      .then(response => response.json())
      .then(data => setBookings(data))
      .catch(error => console.error('Error fetching bookings:', error));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // --- NEW: Function to handle booking cancellation ---
  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      fetch(`http://localhost:8081/bookings/cancel/${bookingId}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          alert('Booking canceled successfully!');
          fetchBookings(); // Refresh the list of bookings
        } else {
          alert('Failed to cancel booking.');
        }
      })
      .catch(error => console.error('Error canceling booking:', error));
    }
  };

  return (
    <div className="bookings-list">
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have not made any bookings yet.</p>
      ) : (
        bookings.map(booking => (
          <div key={booking.bookingId} className="booking-card">
            <h2>Booking ID: {booking.bookingId}</h2>
            <p><strong>Customer:</strong> {booking.customer.firstName} {booking.customer.lastName}</p>
            <p><strong>Flight:</strong> {booking.flight.flightNumber} ({booking.flight.departureAirport} to {booking.flight.arrivalAirport})</p>
            <p><strong>Seats Booked:</strong> {booking.numberOfSeats}</p>
            <p><strong>Status:</strong> <span className="status-confirmed">{booking.status}</span></p>

            {/* --- NEW: Cancel Button --- */}
            <button 
              onClick={() => handleCancelBooking(booking.bookingId)} 
              className="cancel-btn"
            >
              Cancel Booking
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookingsPage;