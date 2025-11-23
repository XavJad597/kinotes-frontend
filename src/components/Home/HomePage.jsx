import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Paperclip, LogOut, Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import noteService from '../../services/NoteService'
import authService from '../../services/AuthService'
import NoteRequestModel from '../../models/NoteRequestModel'

function HomePage() {
  const navigate = useNavigate()
  const [noteText, setNoteText] = useState('')
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const currentUser = authService.getCurrentUser()
      if (!currentUser || !currentUser.userId) {
        throw new Error('User not authenticated')
      }

      // Fetch notes for current user
      const fetchedNotes = await noteService.getNotesByUserId(currentUser.userId)
      setNotes(fetchedNotes)
    } catch (err) {
      console.error('Failed to fetch notes:', err)
      setError(err.message || 'Failed to load notes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNote = async () => {
    if (noteText.trim() === '') return
    
    setIsSaving(true)
    setError('')

    try {
      const currentUser = authService.getCurrentUser()
      if (!currentUser || !currentUser.userId) {
        throw new Error('You must be logged in to create a note')
      }

      // Create note request with title as first line or "Quick Note"
      const lines = noteText.trim().split('\n')
      const title = lines[0].substring(0, 255) || 'Quick Note'
      const content = noteText.trim()

      const noteRequest = NoteRequestModel.create(
        title,
        content,
        currentUser.userId,
        []
      )

      const createdNote = await noteService.createNote(noteRequest)
      
      if (!createdNote.createdAt) {
        createdNote.createdAt = new Date().toISOString()
      }
      
      setNotes([createdNote, ...notes])
      setNoteText('')
    } catch (err) {
      console.error('Failed to save note:', err)
      setError(err.message || 'Failed to save note')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteNote = async (id) => {
    try {
      await noteService.deleteNote(id)
      setNotes(notes.filter(note => note.id !== id))
    } catch (err) {
      console.error('Failed to delete note:', err)
      alert('Failed to delete note: ' + err.message)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveNote()
    }
  }

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 pb-32 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 relative"
          >
            {/* Logout Button */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>

            <h1 className="text-6xl font-bold text-white mb-2 tracking-tight">
              Kinotes
            </h1>
            <p className="text-purple-200 text-lg">
              Your thoughts, beautifully organized
            </p>
          </motion.header>

          {/* Note Input Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 mb-8"
          >
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What's on your mind? (Ctrl+Enter to save)"
              disabled={isSaving}
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-purple-500 transition-colors text-gray-800 placeholder-gray-400 disabled:opacity-50"
            />
            
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveNote}
                disabled={noteText.trim() === '' || isSaving}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {isSaving && <Loader className="animate-spin" size={18} />}
                {isSaving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-white" size={32} />
              <span className="ml-3 text-white">Loading your notes...</span>
            </div>
          )}

          {/* Notes Display Grid */}
          {!isLoading && notes.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-6">
                Your Notes ({notes.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      layout
                      className="bg-white rounded-xl shadow-lg p-5 relative hover:shadow-2xl transition-shadow duration-200"
                    >
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        aria-label="Delete note"
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="pr-8">
                        {note.title && note.title !== note.content?.substring(0, note.title.length) && (
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {note.title}
                          </h3>
                        )}
                        
                        <p className="text-gray-800 whitespace-pre-wrap break-words mb-3">
                          {note.content}
                        </p>
                        
                        <p className="text-xs text-gray-400 mt-2">
                          {note.getFormattedCreatedAt ? note.getFormattedCreatedAt() : new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}


          {!isLoading && notes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <p className="text-purple-200 text-lg">
                No notes yet. Start writing to capture your thoughts! ✨
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/50 to-transparent backdrop-blur-sm py-6"
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 hover:shadow-3xl transition-shadow duration-200">
            <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
              <Paperclip size={22} />
            </button>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Upload files or drag & drop here..."
                className="w-full px-2 py-2 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                readOnly
              />
            </div>
            <div className="text-xs text-gray-400 px-2">
              Coming soon
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default HomePage
