import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import LoginForm from './LoginForm'

function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = (credentials) => {
    // TODO: Implement actual authentication logic
    // For now, just simulate successful login and navigate to home
    console.log('Logging in with:', credentials)
    
    // Simulate authentication success
    setTimeout(() => {
      // Store a simple auth flag (will be replaced with proper auth later)
      localStorage.setItem('isAuthenticated', 'true')
      navigate('/')
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500">
              Sign in to continue to Kinotes
            </p>
          </motion.div>

          {/* Login Form */}
          <LoginForm onSubmit={handleLogin} />
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white text-sm mt-6"
        >
          © 2025 Kinotes. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default LoginPage
