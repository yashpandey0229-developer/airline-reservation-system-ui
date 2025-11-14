import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- 1. IMPORT KAREIN

function EditFlightPage() {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flightData, setFlightData] = useState(null);
  const { token } = useAuth(); // <-- 2. TOKEN KO CONTEXT SE LEIN

  // 1. Fetch the existing flight data
  useEffect(() => {
    // Note: GET requests are public, isliye yahan token ki zaroorat nahi hai
    fetch(`http://localhost:8081/flights/${flightId}`)
      .then(res => res.json())
      .then(data => setFlightData(data))
      .catch(error => console.error("Failed to fetch flight", error));
  }, [flightId]);

  // 2. Handle changes in the form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightData({ ...flightData, [name]: value });
  };

  // 3. Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // --- YEH HAI ASLI FIX ---
    fetch(`http://localhost:8081/flights/update/${flightId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // <-- 3. TOKEN KO HEADER MEIN BHEJEIN
      },
      body: JSON.stringify({
         ...flightData,
        price: parseFloat(flightData.price),
        availableSeats: parseInt(flightData.availableSeats, 10),
      }),
    })
    .then(response => {
      if(response.ok) {
        alert('Flight updated successfully!');
        navigate('/'); // Home page par waapis jaayein
      } else {
        alert('Failed to update flight.');
      }
    });
  };

  if (!flightData) return <div>Loading...</div>;

  return (
    <div className="edit-page">
      <form onSubmit={handleSubmit} className="add-flight-form">
        <h2>Edit Flight: {flightData.flightNumber}</h2>
        <input name="flightNumber" value={flightData.flightNumber} onChange={handleChange} placeholder="Flight Number" required />
        <input name="departureAirport" value={flightData.departureAirport} onChange={handleChange} placeholder="Departure Airport" required />
        <input name="arrivalAirport" value={flightData.arrivalAirport} onChange={handleChange} placeholder="Arrival Airport" required />
        <input name="price" type="number" value={flightData.price} onChange={handleChange} placeholder="Price" required />
        <input name="availableSeats" type="number" value={flightData.availableSeats} onChange={handleChange} placeholder="Available Seats" required />
        <button type="submit">Update Flight</button>
      </form>
    </div>
  );
}

export default EditFlightPage;