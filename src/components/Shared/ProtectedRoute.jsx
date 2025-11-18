import { Navigate } from 'react-router-dom'
import authService from '../../services/AuthService'

function ProtectedRoute({ children }) {
  // Check if user is authenticated using JWT token
  const isAuthenticated = authService.isAuthenticated()

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
