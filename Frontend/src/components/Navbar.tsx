import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

interface NavbarProps {
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
}

export function Navbar({ isLoggedIn, userName, onLogout }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e] text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl text-white no-underline hover:opacity-80">
            SIH Internships
          </Link>

          {/* Logged-out state */}
          {!isLoggedIn && (
            <div className="flex gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#1a1a2e]">
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Logged-in state */}
          {isLoggedIn && (
            <div className="flex items-center gap-6">
              {/* Center links */}
              <div className="flex gap-6">
                <Link 
                  to="/" 
                  className="text-white no-underline hover:opacity-80 transition-opacity"
                >
                  Home
                </Link>
                <Link 
                  to="/internships" 
                  className="text-white no-underline hover:opacity-80 transition-opacity"
                >
                  All Internships
                </Link>
                <Link 
                  to="/profile" 
                  className="text-white no-underline hover:opacity-80 transition-opacity"
                >
                  Profile
                </Link>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                <span className="text-sm">Welcome, {userName}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="text-white border-white hover:bg-white hover:text-[#1a1a2e]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
