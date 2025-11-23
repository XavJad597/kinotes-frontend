import { API_ENDPOINTS, getAuthHeaders } from '../config/api.config'
import NoteModel from '../models/NoteModel'
import NoteRequestModel from '../models/NoteRequestModel'

/**
 * NoteService - Handles all note-related API calls
 * Provides CRUD operations for notes
 */
class NoteService {
  /**
   * Create a new note
   * @param {NoteRequestModel} noteRequest - Note data to create
   * @returns {Promise<NoteModel>}
   * @throws {Error} If creation fails
   */
  async createNote(noteRequest) {
    try {
      // Validate note data
      const validation = noteRequest.validate()
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '))
      }

      const response = await fetch(API_ENDPOINTS.NOTES.CREATE, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(noteRequest.toJSON()),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create note')
      }

      return NoteModel.fromJSON(data)
    } catch (error) {
      console.error('Create note error:', error)
      throw error
    }
  }

  async getAllNotes() {
    try {
      const response = await fetch(API_ENDPOINTS.NOTES.ALL, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notes')
      }

      return data.map(note => NoteModel.fromJSON(note))
    } catch (error) {
      console.error('Get all notes error:', error)
      throw error
    }
  }

  /**
   * Get a note by ID
   * @param {string} noteId - UUID of the note
   * @returns {Promise<NoteModel>}
   * @throws {Error} If fetch fails
   */
  async getNoteById(noteId) {
    try {
      const response = await fetch(API_ENDPOINTS.NOTES.BY_ID(noteId), {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch note')
      }

      return NoteModel.fromJSON(data)
    } catch (error) {
      console.error('Get note by ID error:', error)
      throw error
    }
  }

  /**
   * Get all notes for a specific user
   * @param {string} userId - UUID of the user
   * @returns {Promise<Array<NoteModel>>}
   * @throws {Error} If fetch fails
   */
  async getNotesByUserId(userId) {
    try {
      const response = await fetch(API_ENDPOINTS.NOTES.BY_USER(userId), {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user notes')
      }

      return data.map(note => NoteModel.fromJSON(note))
    } catch (error) {
      console.error('Get notes by user ID error:', error)
      throw error
    }
  }

  /**
   * Update an existing note
   * @param {string} noteId - UUID of the note
   * @param {NoteRequestModel} noteRequest - Updated note data
   * @returns {Promise<NoteModel>}
   * @throws {Error} If update fails
   */
  async updateNote(noteId, noteRequest) {
    try {
      // Validate note data
      const validation = noteRequest.validate()
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '))
      }

      const response = await fetch(API_ENDPOINTS.NOTES.BY_ID(noteId), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(noteRequest.toJSON()),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update note')
      }

      return NoteModel.fromJSON(data)
    } catch (error) {
      console.error('Update note error:', error)
      throw error
    }
  }

  /**
   * Delete a note by ID
   * @param {string} noteId - UUID of the note
   * @returns {Promise<void>}
   * @throws {Error} If deletion fails
   */
  async deleteNote(noteId) {
    try {
      const response = await fetch(API_ENDPOINTS.NOTES.BY_ID(noteId), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete note')
      }
    } catch (error) {
      console.error('Delete note error:', error)
      throw error
    }
  }

  /**
   * Search notes by title
   * @param {string} userId - UUID of the user
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array<NoteModel>>}
   * @throws {Error} If search fails
   */
  async searchNotes(userId, searchTerm) {
    try {
      const response = await fetch(API_ENDPOINTS.NOTES.SEARCH(userId, searchTerm), {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search notes')
      }

      return data.map(note => NoteModel.fromJSON(note))
    } catch (error) {
      console.error('Search notes error:', error)
      throw error
    }
  }
}

// Export a singleton instance
const noteService = new NoteService()
export default noteService
