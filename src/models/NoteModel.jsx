/**
 * Model class for Note data (matches backend NoteResponse)
 * Represents a note retrieved from the backend
 */
class NoteModel {
  constructor(
    id = null,
    title = '',
    content = '',
    imageUrls = [],
    userId = null,
    username = '',
    createdAt = null,
    updatedAt = null
  ) {
    this.id = id // UUID
    this.title = title
    this.content = content
    this.imageUrls = imageUrls // Array of image URL strings
    this.userId = userId // UUID
    this.username = username
    this.createdAt = createdAt // ISO date string
    this.updatedAt = updatedAt // ISO date string
  }

  /**
   * Creates a NoteModel from API response data
   * @param {Object} data - Response data from API
   * @returns {NoteModel}
   */
  static fromJSON(data) {
    return new NoteModel(
      data.id,
      data.title,
      data.content,
      data.imageUrls || [],
      data.userId,
      data.username,
      data.createdAt,
      data.updatedAt
    )
  }

  /**
   * Gets formatted creation date
   * @returns {string}
   */
  getFormattedCreatedAt() {
    if (!this.createdAt) return ''
    return new Date(this.createdAt).toLocaleString()
  }

  /**
   * Gets formatted update date
   * @returns {string}
   */
  getFormattedUpdatedAt() {
    if (!this.updatedAt) return ''
    return new Date(this.updatedAt).toLocaleString()
  }

  /**
   * Gets a short preview of the content
   * @param {number} maxLength - Maximum length of preview
   * @returns {string}
   */
  getContentPreview(maxLength = 100) {
    if (!this.content) return ''
    if (this.content.length <= maxLength) return this.content
    return this.content.substring(0, maxLength) + '...'
  }

  /**
   * Checks if note has images
   * @returns {boolean}
   */
  hasImages() {
    return this.imageUrls && this.imageUrls.length > 0
  }
}

export default NoteModel