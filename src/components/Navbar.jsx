import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- IMPORT useAuth
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth(); // <-- GET user and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">AirlinePro</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/my-bookings">My Bookings</Link>
        <Link to="/customers">Customers</Link>

        <div className="auth-links">
          {user ? (
            <>
              <span className="welcome-user">Welcome, {user.username}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;