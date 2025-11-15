import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. IMPORT KAREIN

function EditCustomerPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const { token } = useAuth(); // 2. TOKEN KO LEIN

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:8081/customers/${customerId}`, {
        headers: { 'Authorization': `Bearer ${token}` } // 3. TOKEN BHEJEIN
    })
      .then(res => res.json())
      .then(data => setCustomerData(data))
      .catch(error => console.error("Failed to fetch customer", error));
  }, [customerId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8081/customers/update/${customerId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // 3. TOKEN BHEJEIN
      },
      body: JSON.stringify(customerData),
    })
    .then(response => {
      if (response.ok) {
        alert('Customer updated successfully!');
        navigate('/customers'); // Customer list page par waapis jaayein
      } else {
        alert('Failed to update customer.');
      }
    });
  };

  if (!customerData) return <div>Loading...</div>;

  return (
    <div className="edit-page">
      {/* ... Aapka baaki ka JSX (form) waisa hi rahega ... */}
      <form onSubmit={handleSubmit} className="add-flight-form">
        <h2>Edit Customer: {customerData.firstName} {customerData.lastName}</h2>
        <input name="firstName" value={customerData.firstName} onChange={handleChange} required />
        <input name="lastName" value={customerData.lastName} onChange={handleChange} required />
        <input name="email" type="email" value={customerData.email} onChange={handleChange} required />
        <input name="phoneNumber" value={customerData.phoneNumber} onChange={handleChange} required />
        <button type="submit">Update Customer</button>
      </form>
    </div>
  );
}

export default EditCustomerPage;