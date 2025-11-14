import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('Registering...');
        try {
            const response = await fetch('http://localhost:8081/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000); // Wait 2 seconds then go to login page
            } else {
                const errorText = await response.text();
                setMessage(`Registration failed: ${errorText}`);
            }
        } catch (error) {
            setMessage('Registration failed due to a network error.');
        }
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleRegister} className="auth-form">
                <h2>Create an Account</h2>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Register</button>
                {message && <p className="auth-message">{message}</p>}
            </form>
        </div>
    );
}
export default RegisterPage;