# Notes System Implementation Guide

## 📁 File Structure

```
src/
├── config/
│   └── api.config.jsx          # Updated with NOTES endpoints
├── models/
│   ├── NoteModel.jsx           # Note response model (from backend)
│   ├── NoteRequestModel.jsx    # Note request model (for create/update)
│   └── AuthResponseModel.jsx   # Updated with userId field
├── services/
│   └── NoteService.jsx         # Complete CRUD operations for notes
├── components/
│   └── Notes/
│       ├── CreateNoteForm.jsx  # Form to create new notes
│       ├── NoteCard.jsx        # Individual note display card
│       ├── NotesList.jsx       # List of all notes
│       └── NotesPage.jsx       # Main notes page component
```

## 🔧 Backend Endpoints

The frontend connects to these backend endpoints:

- **POST** `/api/notes` - Create a new note
- **GET** `/api/notes` - Get all notes
- **GET** `/api/notes/{id}` - Get note by ID
- **GET** `/api/notes/user/{userId}` - Get notes by user ID
- **PUT** `/api/notes/{id}` - Update a note
- **DELETE** `/api/notes/{id}` - Delete a note
- **GET** `/api/notes/search?userId={userId}&term={term}` - Search notes by title

## 📝 Models

### NoteModel (NoteResponse from backend)
Represents a note retrieved from the backend.

**Fields:**
- `id` (UUID) - Note ID
- `title` (string) - Note title
- `content` (string) - Note content
- `imageUrls` (Array<string>) - Array of image URLs
- `userId` (UUID) - Owner user ID
- `username` (string) - Owner username
- `createdAt` (ISO date string) - Creation timestamp
- `updatedAt` (ISO date string) - Last update timestamp

**Methods:**
- `fromJSON(data)` - Creates NoteModel from API response
- `getFormattedCreatedAt()` - Returns formatted creation date
- `getFormattedUpdatedAt()` - Returns formatted update date
- `getContentPreview(maxLength)` - Returns truncated content preview
- `hasImages()` - Checks if note has images

### NoteRequestModel (NoteRequest for backend)
Used when creating or updating a note.

**Fields:**
- `title` (string, required, max 255 chars)
- `content` (string, optional)
- `imageUrls` (Array<string>, optional)
- `userId` (UUID, optional)

**Methods:**
- `validate()` - Validates the note data
- `toJSON()` - Converts to plain object for API
- `fromFormData(formData)` - Creates from form data
- `create(title, content, userId, imageUrls)` - Static factory method

### AuthResponseModel (Updated)
Now includes `userId` field for note operations.

**New Field:**
- `userId` (UUID) - User's unique identifier

## 🔐 NoteService

Complete service class for note CRUD operations.

### Methods

#### `createNote(noteRequest: NoteRequestModel): Promise<NoteModel>`
Creates a new note.

**Usage:**
```javascript
import noteService from '../../services/NoteService'
import NoteRequestModel from '../../models/NoteRequestModel'

const noteRequest = NoteRequestModel.create(
  'My Note Title',
  'Note content here',
  currentUser.userId
)
const createdNote = await noteService.createNote(noteRequest)
```

#### `getAllNotes(): Promise<Array<NoteModel>>`
Retrieves all notes.

**Usage:**
```javascript
const notes = await noteService.getAllNotes()
```

#### `getNoteById(noteId: string): Promise<NoteModel>`
Gets a specific note by ID.

**Usage:**
```javascript
const note = await noteService.getNoteById('uuid-here')
```

#### `getNotesByUserId(userId: string): Promise<Array<NoteModel>>`
Gets all notes for a specific user.

**Usage:**
```javascript
const userNotes = await noteService.getNotesByUserId(currentUser.userId)
```

#### `updateNote(noteId: string, noteRequest: NoteRequestModel): Promise<NoteModel>`
Updates an existing note.

**Usage:**
```javascript
const noteRequest = NoteRequestModel.create(
  'Updated Title',
  'Updated content',
  currentUser.userId
)
const updatedNote = await noteService.updateNote(noteId, noteRequest)
```

#### `deleteNote(noteId: string): Promise<void>`
Deletes a note.

**Usage:**
```javascript
await noteService.deleteNote(noteId)
```

#### `searchNotes(userId: string, searchTerm: string): Promise<Array<NoteModel>>`
Searches notes by title.

**Usage:**
```javascript
const results = await noteService.searchNotes(currentUser.userId, 'search term')
```

## 🎨 Components

### NotesPage
Main page component that combines create form and notes list.

**Features:**
- Displays create note form
- Shows list of all notes
- Handles refresh after note creation

**Usage:**
```javascript
import NotesPage from './components/Notes/NotesPage'

<Route path="/notes" element={
  <ProtectedRoute>
    <NotesPage />
  </ProtectedRoute>
} />
```

### CreateNoteForm
Form component for creating new notes.

**Props:**
- `onNoteCreated(note)` - Callback when note is created

**Features:**
- Title input (required, max 255 chars)
- Content textarea (optional)
- Form validation
- Loading state
- Error handling
- Auto-includes current user ID

### NotesList
Displays a grid of note cards.

**Props:**
- `refreshTrigger` - Number that triggers refresh when changed

**Features:**
- Fetches notes on mount
- Loading state
- Empty state
- Error handling
- Grid layout (responsive)
- Delete functionality
- Edit functionality (placeholder)

### NoteCard
Individual note display card.

**Props:**
- `note` - NoteModel instance
- `onDelete(noteId)` - Delete callback
- `onEdit(note)` - Edit callback

**Features:**
- Displays title, content preview, images
- Shows creation date and username
- Edit and delete buttons
- Hover animations
- Responsive design

## 🔄 Data Flow

### Creating a Note

```
User fills form
    ↓
CreateNoteForm validates input
    ↓
Creates NoteRequestModel with userId
    ↓
Calls noteService.createNote()
    ↓
Service validates and sends POST to /api/notes
    ↓
Backend creates note and returns NoteResponse
    ↓
Service converts to NoteModel
    ↓
Component receives NoteModel
    ↓
Triggers refresh of NotesList
    ↓
NotesList fetches updated notes
    ↓
Displays new note in grid
```

### Fetching Notes

```
NotesList mounts or refreshTrigger changes
    ↓
Calls noteService.getAllNotes()
    ↓
Service sends GET to /api/notes
    ↓
Backend returns array of NoteResponse
    ↓
Service converts each to NoteModel
    ↓
Component receives array of NoteModel
    ↓
Maps to NoteCard components
    ↓
Displays in responsive grid
```

### Deleting a Note

```
User clicks delete button
    ↓
NoteCard shows confirmation dialog
    ↓
Calls onDelete(noteId)
    ↓
NotesList calls noteService.deleteNote()
    ↓
Service sends DELETE to /api/notes/{id}
    ↓
Backend deletes note
    ↓
Component removes note from state
    ↓
UI updates immediately
```

## ⚙️ Backend Changes Made

### 1. AuthResponse DTO Updated
Added `userId` field to AuthResponse:

```java
public record AuthResponse(
    String token,
    String username,
    String role,
    UUID userId  // NEW FIELD
) {}
```

### 2. AuthService Updated
Both `register()` and `login()` methods now include userId:

```java
return new AuthResponse(token, user.getUsername(), user.getRole(), user.getId());
```

This ensures the frontend receives the userId needed for note operations.

## 🚀 Integration Steps

### 1. Add Notes Route to Your App

```javascript
import { Routes, Route } from 'react-router-dom'
import NotesPage from './components/Notes/NotesPage'
import ProtectedRoute from './components/Shared/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* ... other routes ... */}
      
      <Route path="/notes" element={
        <ProtectedRoute>
          <NotesPage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
```

### 2. Add Navigation Link

```javascript
<Link to="/notes">My Notes</Link>
```

### 3. Restart Backend
After updating AuthResponse, restart your Spring Boot backend:

```bash
./mvnw spring-boot:run
```

### 4. Clear Frontend Storage
Clear localStorage to get new auth token with userId:

```javascript
// In browser console
localStorage.clear()
```

Then login again to get the updated auth response with userId.

### 5. Test the Flow

1. Login to your application
2. Navigate to `/notes`
3. Create a new note
4. See it appear in the list
5. Try deleting a note
6. Verify it's removed

## 📋 Validation Rules

### Create Note
- **Title**: Required, max 255 characters
- **Content**: Optional, no length limit
- **ImageUrls**: Optional array of strings
- **UserId**: Automatically included from current user

### Backend Validation
The backend validates:
- Title is not blank
- Title doesn't exceed 255 characters
- User exists if userId is provided

## 🎯 Features Implemented

✅ **Create Note** - With title, content, and automatic user association  
✅ **View All Notes** - Grid display with responsive layout  
✅ **View Note Details** - Full content in card format  
✅ **Delete Note** - With confirmation dialog  
✅ **User Association** - Notes linked to authenticated user  
✅ **Loading States** - Visual feedback during operations  
✅ **Error Handling** - User-friendly error messages  
✅ **Empty States** - Helpful message when no notes exist  
✅ **Responsive Design** - Works on all screen sizes  
✅ **Animations** - Smooth transitions with Framer Motion  

## 🔮 Future Enhancements

- ⏳ **Edit Note** - Update existing notes
- ⏳ **Search Notes** - Search by title
- ⏳ **Filter by User** - View only your notes
- ⏳ **Image Upload** - Add images to notes
- ⏳ **Rich Text Editor** - Formatted content
- ⏳ **Tags/Categories** - Organize notes
- ⏳ **Pagination** - Handle large note lists
- ⏳ **Sort Options** - By date, title, etc.

## 🐛 Troubleshooting

### "You must be logged in to create a note"
- Clear localStorage and login again
- Ensure backend is updated with userId in AuthResponse

### Notes not appearing after creation
- Check browser console for errors
- Verify backend is running on correct port
- Check CORS configuration

### "Failed to create note"
- Verify title is not empty
- Check backend logs for errors
- Ensure user exists in database

### userId is null or undefined
- Backend must be updated with new AuthResponse
- Clear localStorage and login again
- Check that AuthService returns userId

## ✅ Testing Checklist

- [ ] Backend updated with userId in AuthResponse
- [ ] Backend restarted
- [ ] Frontend localStorage cleared
- [ ] User can login successfully
- [ ] userId is stored in localStorage
- [ ] Can navigate to /notes page
- [ ] Can create a note with title only
- [ ] Can create a note with title and content
- [ ] Created note appears in list
- [ ] Can delete a note
- [ ] Deleted note disappears from list
- [ ] Loading states work correctly
- [ ] Error messages display properly
- [ ] Empty state shows when no notes

## 🎉 You're Ready!

Your complete notes system is now integrated! Users can create, view, and delete notes with full authentication and user association.

**Next Steps:**
1. Update your backend (already done)
2. Restart backend server
3. Clear frontend localStorage
4. Login again
5. Navigate to `/notes`
6. Start creating notes!
