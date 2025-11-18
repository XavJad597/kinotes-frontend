import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import LoginForm from './LoginForm'
import authService from '../../services/AuthService'
import LoginModel from '../../models/LoginModel'

function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (credentials) => {
    setIsLoading(true)
    setError('')

    try {
      // Create LoginModel from form data
      const loginData = LoginModel.fromFormData(credentials)
      
      // Call AuthService to login
      const authResponse = await authService.login(loginData)
      
      console.log('Login successful:', authResponse.username)
      
      // Navigate to home page on success
      navigate('/')
    } catch (err) {
      console.error('Login failed:', err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
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

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
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
