/**
 * Model class for Authentication Response
 * Matches the backend AuthResponse DTO
 */
class AuthResponseModel {
  constructor(token, username, role, userId) {
    this.token = token
    this.username = username
    this.role = role
    this.userId = userId // UUID
  }

  /**
   * Creates an AuthResponseModel from API response
   * @param {Object} data - Response data from API
   * @returns {AuthResponseModel}
   */
  static fromJSON(data) {
    return new AuthResponseModel(data.token, data.username, data.role, data.userId)
  }

  /**
   * Saves authentication data to localStorage
   */
  saveToStorage() {
    localStorage.setItem('authToken', this.token)
    localStorage.setItem('username', this.username)
    localStorage.setItem('userRole', this.role)
    localStorage.setItem('userId', this.userId)
    localStorage.setItem('isAuthenticated', 'true')
  }

  /**
   * Retrieves authentication data from localStorage
   * @returns {AuthResponseModel|null}
   */
  static loadFromStorage() {
    const token = localStorage.getItem('authToken')
    const username = localStorage.getItem('username')
    const role = localStorage.getItem('userRole')
    const userId = localStorage.getItem('userId')

    if (token && username && role && userId) {
      return new AuthResponseModel(token, username, role, userId)
    }

    return null
  }

  /**
   * Clears authentication data from localStorage
   */
  static clearStorage() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('username')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('isAuthenticated')
  }

  /**
   * Checks if user is authenticated
   * @returns {boolean}
   */
  static isAuthenticated() {
    return localStorage.getItem('authToken') !== null
  }

  /**
   * Gets the stored auth token
   * @returns {string|null}
   */
  static getToken() {
    return localStorage.getItem('authToken')
  }
}

export default AuthResponseModel
