/**
 * Model class for Registration form data
 * Matches the backend RegisterRequest DTO
 */
class RegistrationModel {
  constructor(username = '', email = '', password = '') {
    this.username = username
    this.email = email
    this.password = password
  }

  /**
   * Validates the registration data
   * @returns {Object} { isValid: boolean, errors: Object }
   */
validate() {
    const errors = {}

    // Username validation
    if (!this.username || this.username.trim() === '') {
    errors.username = 'Username is required'
    } else if (this.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    } else if (this.username.length > 100) {
    errors.username = 'Username must not exceed 100 characters'
    }

    // Email validation
    if (!this.email || this.email.trim() === '') {
    errors.email = 'Email is required'
    } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(this.email)) {
    errors.email = 'Please enter a valid email address'
    }
    }

    // Password validation
    if (!this.password || this.password.trim() === '') {
    errors.password = 'Password is required'
    } else if (this.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    }

    return {
    isValid: Object.keys(errors).length === 0,
    errors
    }
}

/**
   * Converts the model to a plain object for API requests
   * @returns {Object}
   */
toJSON() {
    return {
    username: this.username,
    email: this.email,
    password: this.password
    }
}

/**
   * Creates a RegistrationModel from form data
   * @param {Object} formData
   * @returns {RegistrationModel}
   */
static fromFormData(formData) {
    return new RegistrationModel(
        formData.username,
        formData.email,
        formData.password
    )
}
}

export default RegistrationModel
