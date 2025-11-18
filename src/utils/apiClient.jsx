import { getAuthHeaders } from '../config/api.config'

/**
 * API Client utility for making authenticated HTTP requests
 * Provides convenient methods for common HTTP operations
 */
class ApiClient {
  /**
   * Makes a GET request
   * @param {string} url - The URL to fetch
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  async get(url, options = {}) {
    return this.request(url, {
      method: 'GET',
      ...options,
    })
  }

  /**
   * Makes a POST request
   * @param {string} url - The URL to post to
   * @param {Object} data - The data to send
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  async post(url, data, options = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    })
  }

  /**
   * Makes a PUT request
   * @param {string} url - The URL to put to
   * @param {Object} data - The data to send
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  async put(url, data, options = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    })
  }

  /**
   * Makes a DELETE request
   * @param {string} url - The URL to delete
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  async delete(url, options = {}) {
    return this.request(url, {
      method: 'DELETE',
      ...options,
    })
  }

  /**
   * Makes a PATCH request
   * @param {string} url - The URL to patch
   * @param {Object} data - The data to send
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  async patch(url, data, options = {}) {
    return this.request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    })
  }

  /**
   * Base request method
   * @param {string} url - The URL to request
   * @param {Object} options - Fetch options
   * @returns {Promise<any>}
   * @throws {Error} If the request fails
   */
  async request(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: getAuthHeaders(),
        ...options,
      })

      // Try to parse JSON response
      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      // Handle error responses
      if (!response.ok) {
        const errorMessage = data?.message || data || `HTTP ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }
}

// Export a singleton instance
const apiClient = new ApiClient()
export default apiClient
