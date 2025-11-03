import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import InputField from '../Shared/InputField'

function LoginForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    // Clear error
    setError('')
    
    // Log credentials to console (for now)
    console.log('Login attempt:', formData)
    
    // Call parent onSubmit if provided
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      <InputField
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Enter your username"
        required
      />

      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
      />

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        Login
      </motion.button>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link 
          to="/register" 
          className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
        >
          Register here
        </Link>
      </div>
    </motion.form>
  )
}

export default LoginForm
