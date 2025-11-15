import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // --- YEH HAIN ASLI CHANGES ---
  // Hum ab poora user object (username aur roles) store karenge
  const [user, setUser] = useState(() => {
    // App load hote hi localStorage se purana data lein
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  // --- CHANGES END ---

  const login = (userData) => {
    // userData mein ab { username, roles, token } hai
    localStorage.setItem('token', userData.token);
    // User object ko JSON string banakar save karein
    localStorage.setItem('user', JSON.stringify({ username: userData.username, roles: userData.roles }));

    setToken(userData.token);
    setUser({ username: userData.username, roles: userData.roles });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // User ko bhi remove karein
    setToken(null);
    setUser(null);
  };

  // Ab hum 'user' (object) aur 'token' dono ko value mein bhejenge
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};