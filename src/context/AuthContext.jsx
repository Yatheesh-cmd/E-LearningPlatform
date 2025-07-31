import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(!!sessionStorage.getItem('token'));
  const [role, setRole] = useState(sessionStorage.getItem('role') || null);
  const [username, setUsername] = useState(sessionStorage.getItem('username') || null);

  const login = (token, userRole, userName) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', userRole);
    sessionStorage.setItem('username', userName);
    setAuth(true);
    setRole(userRole);
    setUsername(userName);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('username');
    setAuth(false);
    setRole(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ user: { username, role }, auth, setAuth, role, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};