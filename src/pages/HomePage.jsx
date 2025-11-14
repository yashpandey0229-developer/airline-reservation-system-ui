import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddFlightForm from '../components/AddFlightForm';
import '../App.css';
import { useAuth } from '../context/AuthContext'; // 1. Auth context ko import karein

function HomePage() {
  const { user } = useAuth(); // 2. Logged-in user ka state lein
  const [flights, setFlights] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchFlights = () => {
    fetch('http://localhost:8081/flights/all') // Port check kar lein
      .then(response => response.json())
      .then(data => setFlights(data))
      .catch(error => console.error('Error fetching flights:', error));
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const handleSearch = () => {
    fetch(`http://localhost:8081/flights/search?from=${from}&to=${to}`)
      .then(response => response.json())
      .then(data => setFlights(data))
      .catch(error => console.error('Error searching flights:', error));
  };

  const handleDelete = (flightId) => {
    // Delete function ke liye token ki zaroorat padegi, 
    // lekin hum use 'AddFlightForm' ki tarah next step mein add karenge.
    // Abhi ke liye, yeh basic delete logic hai.
    if (window.confirm('Are you sure you want to delete this flight?')) {
      fetch(`http://localhost:8081/flights/delete/${flightId}`, {
        method: 'DELETE',
        // Headers mein token add karna hoga (next step)
      })
      .then(response => {
        if (response.ok) {
          fetchFlights(); // List ko refresh karein
        } else {
          alert('Failed to delete flight.');
        }
      })
      .catch(error => console.error('Error deleting flight:', error));
    }
  };

  return (
    <>
      {/* --- 3. Condition add karein: Form sirf tab dikhega jab user logged in ho --- */}
      {user && (
        <>
          <AddFlightForm onFlightAdded={fetchFlights} />
          <hr />
        </>
      )}

      <div className="search-container">
        <h2>Search Flights</h2>
        <input 
          type="text" 
          placeholder="From (e.g., DEL)" 
          value={from}
          onChange={(e) => setFrom(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="To (e.g., BOM)" 
          value={to}
          onChange={(e) => setTo(e.target.value)} 
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <h1>Available Flights</h1>
      <div className="flight-list">
        {flights.map(flight => (
          <div key={flight.id} className="flight-card">
            <h2>Flight: {flight.flightNumber}</h2>
            <p>{flight.departureAirport} to {flight.arrivalAirport}</p>
            <p>Price: ₹{flight.price}</p>
            <p>Seats Available: {flight.availableSeats}</p>
            
            <div className="card-buttons">
              <Link to={`/book/${flight.id}`}>
                <button className="book-now-btn">Book Now</button>
              </Link>

              {/* --- 4. Condition add karein: Admin buttons sirf logged-in user ko dikhenge --- */}
              {user && (
                <>
                  <Link to={`/edit-flight/${flight.id}`}>
                    <button className="edit-btn">Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(flight.id)} className="delete-btn">
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default HomePage;