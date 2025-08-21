import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const onLogout = () => {
    logout()
    if (location.pathname !== '/login') navigate('/login')
  }

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">Munna Inventory</Link>
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-600">
                {user?.name || user?.email}
              </span>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg border bg-gray-50 hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg border bg-gray-50 hover:bg-gray-100 text-sm"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
