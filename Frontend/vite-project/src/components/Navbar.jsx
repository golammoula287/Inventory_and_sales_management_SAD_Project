import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return null; // No UI, just keeps auth state accessible
}

// Export auth functions if needed
export { useAuth };
