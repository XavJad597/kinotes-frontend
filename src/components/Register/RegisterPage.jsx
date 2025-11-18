import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import RegisterForm from './RegisterForm'
import authService from '../../services/AuthService'
import RegistrationModel from '../../models/RegistrationModel'

function RegisterPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (userData) => {
    setIsLoading(true)
    setError('')

    try {
      // Create RegistrationModel from form data
      const registrationData = RegistrationModel.fromFormData(userData)
      
      // Call AuthService to register
      const authResponse = await authService.register(registrationData)
      
      console.log('Registration successful:', authResponse.username)
      
      // Navigate to home page on success (user is automatically logged in)
      navigate('/')
    } catch (err) {
      console.error('Registration failed:', err)
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700 px-4">
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
              Create Account
            </h1>
            <p className="text-gray-500">
              Join Kinotes and start organizing your thoughts
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

          {/* Register Form */}
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
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

export default RegisterPage
