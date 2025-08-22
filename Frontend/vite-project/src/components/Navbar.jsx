import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Menu } from 'lucide-react';  // Optional hamburger menu icon

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onLogout = () => {
    logout();
    if (location.pathname !== '/login') navigate('/login');
  };

  return (
    <header className="bg-white border-b shadow-md sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-semibold text-2xl text-indigo-600 hover:text-indigo-800 transition duration-200">
          Munna Inventory
        </Link>

        {/* Hamburger Menu Icon for Mobile */}
        <button
          className="sm:hidden text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={24} />
        </button>

        {/* Navbar Menu */}
        <nav className={`sm:flex items-center gap-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-700 font-medium">
                {user?.name || user?.email}
              </span>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium rounded-lg border border-indigo-600 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 transition duration-200"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
