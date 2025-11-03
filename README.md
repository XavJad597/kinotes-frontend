# Kinotes Frontend

A modern, minimal note-taking web application built with React, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **🔐 User Authentication**: Complete login and registration UI with form validation
- **🛡️ Protected Routes**: Secure access to notes with authentication guards
- **Clean & Modern UI**: Minimalist design with smooth animations
- **Note Management**: Create, view, and delete notes with ease
- **Responsive Grid**: Adapts from 1-3 columns based on screen size
- **Upload Bar**: ChatGPT-style upload interface (UI only, functionality coming soon)
- **Keyboard Shortcuts**: Press Ctrl+Enter to quickly save notes
- **Smooth Animations**: Powered by Framer Motion for delightful interactions

## 📦 Installation

```bash
# Install dependencies
npm install
```

## 🏃 Running the App

```bash
# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## 🛠️ Tech Stack

- **React 18** - UI framework with hooks
- **React Router v6** - Client-side routing and navigation
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon set

## 📁 Project Structure

```
kinotes-frontend/
├── src/
│   ├── components/
│   │   ├── Home/
│   │   │   └── HomePage.jsx          # Main notes dashboard
│   │   ├── Login/
│   │   │   ├── LoginPage.jsx         # Login page container
│   │   │   └── LoginForm.jsx         # Login form component
│   │   ├── Register/
│   │   │   ├── RegisterPage.jsx      # Registration page container
│   │   │   └── RegisterForm.jsx      # Registration form component
│   │   └── Shared/
│   │       ├── InputField.jsx        # Reusable input component
│   │       └── ProtectedRoute.jsx    # Route authentication guard
│   ├── App.jsx                        # Router configuration
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Global styles with Tailwind
├── index.html                         # HTML template
├── package.json                       # Dependencies
├── vite.config.js                     # Vite configuration
├── tailwind.config.js                 # Tailwind configuration
└── postcss.config.js                  # PostCSS configuration
```

## 🎨 Design Features

- **Gradient Background**: Purple gradient for visual appeal
- **Card-based Notes**: Each note is a card with rounded corners and shadows
- **Hover Effects**: Interactive elements respond to user interaction
- **Fixed Upload Bar**: Stays at the bottom like ChatGPT's interface
- **Empty State**: Friendly message when no notes exist

## 🔮 Future Enhancements

- **Backend Integration**: Connect to Keycloak or Supabase Auth for real authentication
- **Persistent Storage**: Save notes to database (Supabase/PostgreSQL)
- **File Upload**: Implement actual file upload functionality
- **Note Editing**: Edit existing notes
- **Search & Filter**: Find notes quickly
- **Categories/Tags**: Organize notes by topic
- **Dark Mode**: Theme toggle support
- **User Profile**: Manage account settings

## 🔒 Authentication (Current Implementation)

The current authentication is **UI-only** using localStorage for demonstration:
- Login stores `isAuthenticated: true` in localStorage
- Protected routes check this flag
- Logout removes the flag and redirects to login

**⚠️ Note**: This is NOT production-ready security. Real authentication with JWT tokens and backend validation will be implemented in the next phase.

## 📝 Usage

### Authentication Flow
1. **First Visit**: You'll be redirected to the login page (`/login`)
2. **New User**: Click "Register here" to create an account at `/register`
3. **Registration**: Fill in username, email, and password (min. 6 characters)
4. **Login**: Enter your credentials to access the notes dashboard
5. **Logout**: Click the logout button in the top-right corner of the homepage

### Note Management
1. Type your note in the text area
2. Click "Save Note" or press Ctrl+Enter
3. View your notes in the responsive grid below
4. Delete notes using the trash icon in the top-right corner

### Routes
- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/` - Notes dashboard (protected, requires authentication)

---

Built with ❤️ for Kinotes
