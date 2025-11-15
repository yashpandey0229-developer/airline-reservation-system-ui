import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // LoginPage.jsx ke andar
const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');
    try {
        const response = await fetch('http://localhost:8081/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json(); // data mein ab { token, username, roles } hai

            // --- YEH HAI ASLI CHANGE ---
            // Poora data object (token, username, roles) login function ko dein
            login({ 
                token: data.token, 
                username: data.username, 
                roles: data.roles 
            });
            // --- CHANGE END ---

            navigate('/');
        } else {
            const errorText = await response.text();
            setMessage(errorText);
        }
    } catch (error) {
        setMessage('Login failed due to a network error.');
    }
};

  return (
    <div className="auth-form-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Login to Your Account</h2>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
}

// THIS IS THE MISSING LINE
export default LoginPage;