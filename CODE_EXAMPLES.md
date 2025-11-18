# 💻 Code Examples - Authentication System

## 📋 Table of Contents
1. [Login Examples](#login-examples)
2. [Registration Examples](#registration-examples)
3. [Logout Examples](#logout-examples)
4. [Protected Routes](#protected-routes)
5. [Making Authenticated API Calls](#making-authenticated-api-calls)
6. [User Information](#user-information)
7. [Custom Hooks](#custom-hooks)

---

## Login Examples

### Basic Login in a Component
```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/AuthService'
import LoginModel from '../models/LoginModel'

function MyLoginComponent() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (username, password) => {
    setIsLoading(true)
    setError('')

    try {
      const loginData = LoginModel.fromFormData({ username, password })
      const authResponse = await authService.login(loginData)
      
      console.log('Login successful!', authResponse.username)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={() => handleLogin('myuser', 'mypass')} disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  )
}
```

### Login with Form Validation
```javascript
import { useState } from 'react'
import authService from '../services/AuthService'
import LoginModel from '../models/LoginModel'

function LoginWithValidation() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create and validate model
    const loginData = LoginModel.fromFormData(formData)
    const validation = loginData.validate()

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    try {
      await authService.login(loginData)
      // Success!
    } catch (err) {
      setErrors({ general: err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      {errors.username && <span>{errors.username}</span>}
      
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {errors.password && <span>{errors.password}</span>}
      
      {errors.general && <div>{errors.general}</div>}
      <button type="submit">Login</button>
    </form>
  )
}
```

---

## Registration Examples

### Basic Registration
```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/AuthService'
import RegistrationModel from '../models/RegistrationModel'

function RegisterComponent() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (username, email, password) => {
    setIsLoading(true)

    try {
      const registrationData = RegistrationModel.fromFormData({
        username,
        email,
        password
      })

      const authResponse = await authService.register(registrationData)
      
      console.log('Registration successful!', authResponse.username)
      // User is automatically logged in
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration failed:', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={() => handleRegister('newuser', 'user@example.com', 'password123')}
      disabled={isLoading}
    >
      {isLoading ? 'Creating account...' : 'Register'}
    </button>
  )
}
```

### Registration with Validation
```javascript
import { useState } from 'react'
import authService from '../services/AuthService'
import RegistrationModel from '../models/RegistrationModel'

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create and validate model
    const registrationData = RegistrationModel.fromFormData(formData)
    const validation = registrationData.validate()

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    try {
      await authService.register(registrationData)
      // Success - user is logged in
    } catch (err) {
      setErrors({ general: err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username (3-100 chars)"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      {errors.username && <span>{errors.username}</span>}

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      {errors.email && <span>{errors.email}</span>}

      <input
        type="password"
        placeholder="Password (min 8 chars)"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {errors.password && <span>{errors.password}</span>}

      {errors.general && <div>{errors.general}</div>}
      <button type="submit">Register</button>
    </form>
  )
}
```

---

## Logout Examples

### Simple Logout Button
```javascript
import { useNavigate } from 'react-router-dom'
import authService from '../services/AuthService'

function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}
```

### Logout with Confirmation
```javascript
import { useNavigate } from 'react-router-dom'
import authService from '../services/AuthService'

function LogoutWithConfirmation() {
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout()
      navigate('/login')
    }
  }

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}
```

### Logout in Navigation Bar
```javascript
import { useNavigate } from 'react-router-dom'
import authService from '../services/AuthService'

function NavigationBar() {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <nav>
      <div>Welcome, {user?.username}!</div>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  )
}
```

---

## Protected Routes

### Basic Protected Route Usage
```javascript
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/Shared/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import LoginPage from './components/Login/LoginPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
```

### Multiple Protected Routes
```javascript
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/Shared/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
      <Route path="/notes/:id" element={<ProtectedRoute><NoteDetail /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    </Routes>
  )
}
```

---

## Making Authenticated API Calls

### Using apiClient Utility

#### GET Request
```javascript
import apiClient from '../utils/apiClient'

async function fetchNotes() {
  try {
    const notes = await apiClient.get('http://localhost:8080/api/notes')
    console.log('Notes:', notes)
    return notes
  } catch (error) {
    console.error('Failed to fetch notes:', error.message)
  }
}
```

#### POST Request
```javascript
import apiClient from '../utils/apiClient'

async function createNote(title, content) {
  try {
    const newNote = await apiClient.post('http://localhost:8080/api/notes', {
      title,
      content
    })
    console.log('Created note:', newNote)
    return newNote
  } catch (error) {
    console.error('Failed to create note:', error.message)
  }
}
```

#### PUT Request
```javascript
import apiClient from '../utils/apiClient'

async function updateNote(noteId, updates) {
  try {
    const updatedNote = await apiClient.put(
      `http://localhost:8080/api/notes/${noteId}`,
      updates
    )
    console.log('Updated note:', updatedNote)
    return updatedNote
  } catch (error) {
    console.error('Failed to update note:', error.message)
  }
}
```

#### DELETE Request
```javascript
import apiClient from '../utils/apiClient'

async function deleteNote(noteId) {
  try {
    await apiClient.delete(`http://localhost:8080/api/notes/${noteId}`)
    console.log('Note deleted successfully')
  } catch (error) {
    console.error('Failed to delete note:', error.message)
  }
}
```

### Using Fetch Directly with Auth Headers
```javascript
import { getAuthHeaders } from '../config/api.config'

async function fetchUserProfile() {
  try {
    const response = await fetch('http://localhost:8080/api/user/profile', {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }

    const profile = await response.json()
    return profile
  } catch (error) {
    console.error('Error:', error.message)
  }
}
```

---

## User Information

### Get Current User
```javascript
import authService from '../services/AuthService'

function UserProfile() {
  const user = authService.getCurrentUser()

  if (!user) {
    return <div>Not logged in</div>
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>
      <p>Token: {user.token.substring(0, 20)}...</p>
    </div>
  )
}
```

### Check Authentication Status
```javascript
import { useEffect, useState } from 'react'
import authService from '../services/AuthService'

function AuthStatus() {
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    setIsAuth(authService.isAuthenticated())
  }, [])

  return (
    <div>
      Status: {isAuth ? 'Logged In' : 'Logged Out'}
    </div>
  )
}
```

### Display User Info in Header
```javascript
import authService from '../services/AuthService'

function Header() {
  const user = authService.getCurrentUser()

  return (
    <header>
      <h1>Kinotes</h1>
      {user && (
        <div>
          <span>Welcome, {user.username}</span>
          <span>({user.role})</span>
        </div>
      )}
    </header>
  )
}
```

---

## Custom Hooks

### useAuth Hook
```javascript
import { useState, useEffect } from 'react'
import authService from '../services/AuthService'

function useAuth() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsAuthenticated(authService.isAuthenticated())
  }, [])

  const login = async (loginData) => {
    const authResponse = await authService.login(loginData)
    setUser(authResponse)
    setIsAuthenticated(true)
    return authResponse
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  return { user, isAuthenticated, login, logout }
}

export default useAuth
```

### Using the useAuth Hook
```javascript
import useAuth from '../hooks/useAuth'
import LoginModel from '../models/LoginModel'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  const handleLogin = async () => {
    const loginData = LoginModel.fromFormData({
      username: 'myuser',
      password: 'mypass'
    })

    try {
      await login(loginData)
      console.log('Logged in!')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

### useApi Hook for Data Fetching
```javascript
import { useState, useEffect } from 'react'
import apiClient from '../utils/apiClient'

function useApi(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await apiClient.get(url)
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}

export default useApi
```

### Using the useApi Hook
```javascript
import useApi from '../hooks/useApi'

function NotesList() {
  const { data: notes, loading, error } = useApi('http://localhost:8080/api/notes')

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <ul>
      {notes.map(note => (
        <li key={note.id}>{note.title}</li>
      ))}
    </ul>
  )
}
```

---

## 🎉 Complete Example: Full Auth Flow

```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/AuthService'
import LoginModel from '../models/LoginModel'
import RegistrationModel from '../models/RegistrationModel'

function AuthPage() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        // Login
        const loginData = LoginModel.fromFormData(formData)
        await authService.login(loginData)
      } else {
        // Register
        const registrationData = RegistrationModel.fromFormData(formData)
        await authService.register(registrationData)
      }
      
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />

        {!isLogin && (
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  )
}

export default AuthPage
```

---

## 📚 More Resources

- See **AUTH_IMPLEMENTATION.md** for detailed documentation
- See **QUICK_START.md** for setup instructions
- See **FILE_STRUCTURE_SUMMARY.md** for architecture overview
