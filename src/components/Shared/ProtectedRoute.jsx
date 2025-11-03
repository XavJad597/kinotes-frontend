import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  // Check if user is authenticated (simple localStorage check for now)
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
