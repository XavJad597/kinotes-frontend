import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Paperclip, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()
  const [noteText, setNoteText] = useState('')
  const [notes, setNotes] = useState([])

  const handleSaveNote = () => {
    if (noteText.trim() === '') return
    
    const newNote = {
      id: Date.now(),
      content: noteText,
      createdAt: new Date().toLocaleString()
    }
    
    setNotes([newNote, ...notes])
    setNoteText('')
  }

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveNote()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
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
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-purple-500 transition-colors text-gray-800 placeholder-gray-400"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveNote}
                disabled={noteText.trim() === ''}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Save Note
              </button>
            </div>
          </motion.div>

          {/* Notes Display Grid */}
          {notes.length > 0 && (
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

                      {/* Note Content */}
                      <div className="pr-8">
                        <p className="text-gray-800 whitespace-pre-wrap break-words mb-3">
                          {note.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {note.createdAt}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {notes.length === 0 && (
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

      {/* Upload Bar (ChatGPT-style) */}
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
