import MyBookingsPage from './pages/MyBookingsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import EditFlightPage from './pages/EditFlightPage';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage'; // <-- IMPORT THIS
import Navbar from './components/Navbar';
import EditCustomerPage from './pages/EditCustomerPage';
import './App.css';
import RegisterPage from './pages/RegisterPage'; // <-- IMPORT
import LoginPage from './pages/LoginPage';       // <-- IMPORT
function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book/:flightId" element={<BookingPage />} /> {/* <-- ADD THIS LINE */}
            <Route path="/my-bookings" element={<MyBookingsPage />} /> 
            <Route path="/edit-flight/:flightId" element={<EditFlightPage />} />
             <Route path="/customers" element={<CustomersPage />} />
             <Route path="/edit-customer/:customerId" element={<EditCustomerPage />} />
               <Route path="/register" element={<RegisterPage />} /> {/* <-- ADD ROUTE */}
          <Route path="/login" element={<LoginPage />} />       {/* <-- ADD ROUTE */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;