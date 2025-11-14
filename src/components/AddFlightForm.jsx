import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 

function AddFlightForm({ onFlightAdded }) {
  const [flightData, setFlightData] = useState({
    flightNumber: '',
    departureAirport: '',
    arrivalAirport: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    availableSeats: '',
  });
  const { token } = useAuth(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightData({ ...flightData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('http://localhost:8081/flights/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Token bhej rahe hain
      },
      body: JSON.stringify({
        ...flightData,
        price: parseFloat(flightData.price),
        availableSeats: parseInt(flightData.availableSeats, 10),
      }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add flight. Are you logged in?');
        }
        return response.json();
    })
    .then(newFlight => {
      console.log('Success:', newFlight);
      onFlightAdded(); 
      setFlightData({
        flightNumber: '', departureAirport: '', arrivalAirport: '',
        departureTime: '', arrivalTime: '', price: '', availableSeats: '',
      });
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(error.message);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="add-flight-form">
      <h2>Add a New Flight</h2>
      <input name="flightNumber" value={flightData.flightNumber} onChange={handleChange} placeholder="Flight Number" required />
      <input name="departureAirport" value={flightData.departureAirport} onChange={handleChange} placeholder="Departure Airport (e.g., DEL)" required />
      <input name="arrivalAirport" value={flightData.arrivalAirport} onChange={handleChange} placeholder="Arrival Airport (e.g., BOM)" required />
      <input name="price" type="number" value={flightData.price} onChange={handleChange} placeholder="Price" required />
      <input name="availableSeats" type="number" value={flightData.availableSeats} onChange={handleChange} placeholder="Available Seats" required />
      <input name="departureTime" type="datetime-local" value={flightData.departureTime} onChange={handleChange} required />
      <input name="arrivalTime" type="datetime-local" value={flightData.arrivalTime} onChange={handleChange} required />
      <button type="submit">Add Flight</button>
    </form>
  );
}

export default AddFlightForm; // <-- YEH LINE MISSING THI