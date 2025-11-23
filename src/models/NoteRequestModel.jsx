/**
 * Model class for Note Request data (matches backend NoteRequest)
 * Used when creating or updating a note
 */
class NoteRequestModel {
  constructor(title = '', content = '', imageUrls = [], userId = null) {
    this.title = title
    this.content = content
    this.imageUrls = imageUrls // Array of image URL strings
    this.userId = userId // UUID - optional
  }

  /**
   * Validates the note request data
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  validate() {
    const errors = {}

    // Title validation
    if (!this.title || this.title.trim() === '') {
      errors.title = 'Title is required'
    } else if (this.title.length > 255) {
      errors.title = 'Title must not exceed 255 characters'
    }

    // Content is optional, no validation needed

    // ImageUrls validation
    if (this.imageUrls && !Array.isArray(this.imageUrls)) {
      errors.imageUrls = 'Image URLs must be an array'
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
    const json = {
      title: this.title,
      content: this.content,
      imageUrls: this.imageUrls || []
    }

    // Only include userId if it's provided
    if (this.userId) {
      json.userId = this.userId
    }

    return json
  }

  /**
   * Creates a NoteRequestModel from form data
   * @param {Object} formData
   * @returns {NoteRequestModel}
   */
  static fromFormData(formData) {
    return new NoteRequestModel(
      formData.title,
      formData.content,
      formData.imageUrls || [],
      formData.userId
    )
  }

  /**
   * Creates a NoteRequestModel with user ID
   * @param {string} title
   * @param {string} content
   * @param {string} userId - UUID
   * @param {Array<string>} imageUrls
   * @returns {NoteRequestModel}
   */
  static create(title, content, userId, imageUrls = []) {
    return new NoteRequestModel(title, content, imageUrls, userId)
  }
}

export default NoteRequestModel
