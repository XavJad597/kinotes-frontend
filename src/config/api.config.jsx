/**
 * API Configuration
 * Central configuration for all API endpoints
 */

// Base API URL - Change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6543'/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  // Add more endpoints as needed
}

/**
 * Default headers for API requests
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
}

/**
 * Get authorization headers with JWT token
 * @returns {Object}
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    ...DEFAULT_HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export default API_BASE_URL
