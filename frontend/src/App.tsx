import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from './services/api';
import type { User } from './types';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Strategies from './pages/Strategies';
import StrategyDetails from './pages/StrategyDetails';
import CreateStrategy from './pages/CreateStrategy';
import EditStrategy from './pages/EditStrategy';
import AdminPanel from './pages/AdminPanel';

import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setLoading(false);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  }

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/strategies" element={<Strategies user={user} />} /> 
        <Route path="/strategies/:id" element={<StrategyDetails user={user} />} />
        <Route path="/strategies/:id/edit" element={<EditStrategy user={user} />} />
        <Route path="/create" element={<CreateStrategy user={user} />} />
        <Route path="/admin" element={<AdminPanel user={user} />} />
      </Routes>
      <Footer user={user} />
    </BrowserRouter>
  );
}

export default App;