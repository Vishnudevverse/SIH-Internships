import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { HomePage } from './components/pages/HomePage';
import { InternshipsPage } from './components/pages/InternshipsPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { Toaster } from './components/ui/sonner';
import { supabase } from './utils/supabase/client';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
        setAccessToken(data.session.access_token);
        setUserName(data.session.user.user_metadata.name || data.session.user.email?.split('@')[0] || 'User');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token: string, name: string) => {
    setIsLoggedIn(true);
    setAccessToken(token);
    setUserName(name);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setAccessToken('');
      setUserName('');
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
