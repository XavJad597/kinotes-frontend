import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import RegisterForm from './RegisterForm'

function RegisterPage() {
  const navigate = useNavigate()

  const handleRegister = (userData) => {
    // TODO: Implement actual registration logic
    // For now, just simulate successful registration and navigate to login
    console.log('Registering user:', userData)
    
    // Simulate registration success
    setTimeout(() => {
      alert('Registration successful! Please login.')
      navigate('/login')
    }, 500)
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

          {/* Register Form */}
          <RegisterForm onSubmit={handleRegister} />
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
