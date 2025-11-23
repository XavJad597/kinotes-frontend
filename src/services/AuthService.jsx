import { API_ENDPOINTS, DEFAULT_HEADERS } from '../config/api.config'
import AuthResponseModel from '../models/AuthResponseModel'
import LoginModel from '../models/LoginModel'
import RegistrationModel from '../models/RegistrationModel'

/**
 * AuthService - Handles all authentication-related API calls
 */
class AuthService {
/**
   * Login user with credentials
   * @param {LoginModel} loginData - Login credentials
   * @returns {Promise<AuthResponseModel>}
   * @throws {Error} If login fails
   */
async login(loginData) {
    try {
      // Validate login data
    const validation = loginData.validate()
    if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '))
    }

    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(loginData.toJSON()),
    })

    const data = await response.json()

    if (!response.ok) {
        // Handle error response
        throw new Error(data.message || 'Invalid username or password')
    }

    // Create and save auth response
    const authResponse = AuthResponseModel.fromJSON(data)
    authResponse.saveToStorage()

    return authResponse
    } catch (error) {
    console.error('Login error:', error)
    throw error
    }
}

async register(registrationData) {
    try {
      // Validate registration data
    const validation = registrationData.validate()
    if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '))
    }

    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(registrationData.toJSON()),
    })

    const data = await response.json()

    if (!response.ok) {
        // Handle error response
        throw new Error(data.message || 'Registration failed')
    }

    // Create and save auth response
    const authResponse = AuthResponseModel.fromJSON(data)
    authResponse.saveToStorage()

    return authResponse
    } catch (error) {
    console.error('Registration error:', error)
    throw error
    }
}

    /**
   * Logout user
   * Clears authentication data from storage
   */
logout() {
    AuthResponseModel.clearStorage()
}

/**
   * Check if user is authenticated
   * @returns {boolean}
   */
isAuthenticated() {
    return AuthResponseModel.isAuthenticated()
}

/**
   * Get current user's auth data from storage
   * @returns {AuthResponseModel|null}
   */
getCurrentUser() {
    return AuthResponseModel.loadFromStorage()
}

/**
   * Get the current auth token
   * @returns {string|null}
   */
getToken() {
    return AuthResponseModel.getToken()
}
}

// Export a singleton instance
const authService = new AuthService()
export default authService
