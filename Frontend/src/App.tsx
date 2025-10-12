import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { HomePage } from './components/pages/HomePage';
import { InternshipsPage } from './components/pages/InternshipsPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    const token = localStorage.getItem('accessToken');
    const name = localStorage.getItem('userName');
    if (token && name) {
      setIsLoggedIn(true);
      setAccessToken(token);
      setUserName(name);
    }
    setLoading(false);
  };

  const handleLogin = (token: string, name: string) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userName', name);
    setIsLoggedIn(true);
    setAccessToken(token);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setAccessToken('');
    setUserName('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          userName={userName} 
          onLogout={handleLogout}
        />
        
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              isLoggedIn ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              isLoggedIn ? <Navigate to="/" replace /> : <RegisterPage />
            } 
          />

          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              isLoggedIn ? (
                <HomePage accessToken={accessToken} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/internships" 
            element={
              isLoggedIn ? (
                <InternshipsPage />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/profile" 
            element={
              isLoggedIn ? (
                <ProfilePage accessToken={accessToken} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster />
      </div>
    </BrowserRouter>
  );
}