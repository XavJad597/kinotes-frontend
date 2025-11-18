/**
 * Model class for Login form data
 * Matches the backend LoginRequest DTO
 */
class LoginModel {
  constructor(username = '', password = '') {
    this.username = username
    this.password = password
  }

  /**
   * Validates the login data
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  validate() {
    const errors = {}

    if (!this.username || this.username.trim() === '') {
      errors.username = 'Username is required'
    }

    if (!this.password || this.password.trim() === '') {
      errors.password = 'Password is required'
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
      password: this.password
    }
  }

  /**
   * Creates a LoginModel from form data
   * @param {Object} formData
   * @returns {LoginModel}
   */
  static fromFormData(formData) {
    return new LoginModel(formData.username, formData.password)
  }
}

export default LoginModel
