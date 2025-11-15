import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. IMPORT KAREIN
import '../App.css';

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [customerData, setCustomerData] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '',
  });
  const { token } = useAuth(); // 2. TOKEN KO LEIN

  const fetchCustomers = () => {
    if (!token) return;
    fetch('http://localhost:8081/customers/all', {
        headers: { 'Authorization': `Bearer ${token}` } // 3. TOKEN BHEJEIN
    })
      .then(response => response.json())
      .then(data => setCustomers(data))
      .catch(error => console.error('Error fetching customers:', error));
  };

  useEffect(() => {
    fetchCustomers();
  }, [token]);

  const handleChange = (e) => { /* ... yeh waisa hi rahega ... */ };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8081/customers/add', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // 3. TOKEN BHEJEIN
      },
      body: JSON.stringify(customerData),
    })
    .then(response => response.json())
    .then(() => {
      fetchCustomers();
      setCustomerData({ firstName: '', lastName: '', email: '', phoneNumber: '' });
    })
    .catch(error => console.error('Error adding customer:', error));
  };

  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      fetch(`http://localhost:8081/customers/delete/${customerId}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` } // 3. TOKEN BHEJEIN
      })
        .then(response => {
          if (response.ok) fetchCustomers();
          else alert('Failed to delete customer.');
        });
    }
  };

  // handleChange ko define karein
  handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  return (
    <div>
      {/* ... Aapka baaki ka JSX (form, list) waisa hi rahega ... */}
      <form onSubmit={handleSubmit} className="add-flight-form">
        <h2>Add a New Customer</h2>
        <input name="firstName" value={customerData.firstName} onChange={handleChange} placeholder="First Name" required />
        <input name="lastName" value={customerData.lastName} onChange={handleChange} placeholder="Last Name" required />
        <input name="email" type="email" value={customerData.email} onChange={handleChange} placeholder="Email" required />
        <input name="phoneNumber" value={customerData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
        <button type="submit">Add Customer</button>
      </form>
      <hr />
      <h1>All Customers</h1>
      <div className="customer-list">
        {customers.map(customer => (
          <div key={customer.customerId} className="customer-card">
            <h3>{customer.firstName} {customer.lastName}</h3>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {customer.phoneNumber}</p>
            <div className="card-buttons">
              <Link to={`/edit-customer/${customer.customerId}`}>
                <button className="edit-btn">Edit</button>
              </Link>
              <button onClick={() => handleDelete(customer.customerId)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomersPage;