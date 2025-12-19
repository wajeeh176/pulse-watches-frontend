// client/src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute({ children }) {
  const { user } = useAuth(); // Access logged-in user from AuthContext
  return user ? children : <Navigate to="/login" />; // If no user, redirect to login
}
