# Quick Start Guide - Authentication System

## 🚀 Setup

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the backend URL in `.env`:**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

3. **Start your backend server** (should be running on port 8080)

4. **Start the frontend:**
   ```bash
   npm run dev
   ```

## 📋 What Was Implemented

### ✅ Models (src/models/)
- **LoginModel.jsx** - Login form data with validation
- **RegistrationModel.jsx** - Registration form data with validation
- **AuthResponseModel.jsx** - Auth response handling and storage

### ✅ Services (src/services/)
- **AuthService.jsx** - Complete authentication service
  - `login(loginData)` - Login user
  - `register(registrationData)` - Register new user
  - `logout()` - Logout user
  - `isAuthenticated()` - Check auth status
  - `getCurrentUser()` - Get current user data
  - `getToken()` - Get JWT token

### ✅ Configuration (src/config/)
- **api.config.jsx** - API endpoints and headers configuration

### ✅ Utilities (src/utils/)
- **apiClient.jsx** - HTTP client for authenticated requests

### ✅ Updated Components
- **LoginPage.jsx** - Now uses AuthService for real authentication
- **LoginForm.jsx** - Added loading state
- **RegisterPage.jsx** - Now uses AuthService for real registration
- **RegisterForm.jsx** - Added loading state, updated validation (8 chars min)
- **ProtectedRoute.jsx** - Now uses JWT token authentication

## 🔧 How to Use

### Login Example
```javascript
import authService from './services/AuthService'
import LoginModel from './models/LoginModel'

const loginData = LoginModel.fromFormData({
  username: 'myusername',
  password: 'mypassword'
})

try {
  const authResponse = await authService.login(loginData)
  console.log('Logged in as:', authResponse.username)
  // User is now authenticated, token is stored
} catch (error) {
  console.error('Login failed:', error.message)
}
```

### Register Example
```javascript
import authService from './services/AuthService'
import RegistrationModel from './models/RegistrationModel'

const registrationData = RegistrationModel.fromFormData({
  username: 'newuser',
  email: 'user@example.com',
  password: 'securepassword123'
})

try {
  const authResponse = await authService.register(registrationData)
  console.log('Registered and logged in as:', authResponse.username)
  // User is now authenticated, token is stored
} catch (error) {
  console.error('Registration failed:', error.message)
}
```

### Making Authenticated API Calls
```javascript
import apiClient from './utils/apiClient'

// GET request
const notes = await apiClient.get('http://localhost:8080/api/notes')

// POST request
const newNote = await apiClient.post('http://localhost:8080/api/notes', {
  title: 'My Note',
  content: 'Note content'
})

// PUT request
const updated = await apiClient.put('http://localhost:8080/api/notes/123', {
  title: 'Updated Title'
})

// DELETE request
await apiClient.delete('http://localhost:8080/api/notes/123')
```

### Logout Example
```javascript
import authService from './services/AuthService'
import { useNavigate } from 'react-router-dom'

function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return <button onClick={handleLogout}>Logout</button>
}
```

### Check Authentication Status
```javascript
import authService from './services/AuthService'

if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser()
  console.log(`Logged in as: ${user.username}`)
  console.log(`Role: ${user.role}`)
}
```

## 🔐 Backend Endpoints Used

- **POST** `/api/auth/login`
  - Body: `{ username, password }`
  - Returns: `{ token, username, role }`

- **POST** `/api/auth/register`
  - Body: `{ username, email, password }`
  - Returns: `{ token, username, role }`

## 📝 Validation Rules

### Login
- Username: Required
- Password: Required

### Registration
- Username: Required, 3-100 characters
- Email: Required, valid email format
- Password: Required, minimum 8 characters

## 🎯 Testing Checklist

- [ ] Register a new account
- [ ] Verify automatic login after registration
- [ ] Logout and login with the created account
- [ ] Try accessing protected routes without authentication
- [ ] Verify redirect to login page when not authenticated
- [ ] Test form validation (empty fields, invalid email, short password)
- [ ] Test error handling (wrong credentials, duplicate username/email)

## 📚 Additional Documentation

For detailed implementation details, see:
- **AUTH_IMPLEMENTATION.md** - Complete implementation guide
- **AUTHENTICATION_GUIDE.md** - Original authentication documentation

## 🆘 Troubleshooting

**Problem:** CORS errors
- **Solution:** Configure CORS in your backend to allow requests from `http://localhost:5173` (or your frontend URL)

**Problem:** Connection refused
- **Solution:** Make sure backend is running on port 8080

**Problem:** "Invalid credentials" error
- **Solution:** Check username/password are correct and user exists in database

**Problem:** Token not persisting
- **Solution:** Clear localStorage and try again. Check browser console for errors.

## 🎉 You're Ready!

Your authentication system is fully integrated and ready to use. The frontend now communicates with your backend for real authentication!
