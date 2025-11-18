# Authentication Implementation Guide

## 📁 File Structure

```
src/
├── config/
│   └── api.config.jsx          # API configuration and endpoints
├── models/
│   ├── LoginModel.jsx          # Login form data model
│   ├── RegistrationModel.jsx   # Registration form data model
│   └── AuthResponseModel.jsx   # Authentication response model
├── services/
│   └── AuthService.jsx         # Authentication service (API calls)
├── components/
│   ├── Login/
│   │   ├── LoginPage.jsx       # Login page component (updated)
│   │   └── LoginForm.jsx       # Login form component (updated)
│   ├── Register/
│   │   ├── RegisterPage.jsx    # Register page component (updated)
│   │   └── RegisterForm.jsx    # Register form component (updated)
│   └── Shared/
│       └── ProtectedRoute.jsx  # Protected route component (updated)
```

## 🔧 Backend Endpoints

The frontend connects to these backend endpoints:

- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/register` - User registration

## 📝 Models

### LoginModel
Represents login form data with validation.

**Fields:**
- `username` (required)
- `password` (required)

**Methods:**
- `validate()` - Validates the login data
- `toJSON()` - Converts to plain object for API requests
- `fromFormData(formData)` - Static method to create from form data

### RegistrationModel
Represents registration form data with validation.

**Fields:**
- `username` (required, 3-100 characters)
- `email` (required, valid email format)
- `password` (required, minimum 8 characters)

**Methods:**
- `validate()` - Validates the registration data
- `toJSON()` - Converts to plain object for API requests
- `fromFormData(formData)` - Static method to create from form data

### AuthResponseModel
Represents authentication response from backend.

**Fields:**
- `token` - JWT authentication token
- `username` - User's username
- `role` - User's role (e.g., "owner", "user")

**Methods:**
- `fromJSON(data)` - Creates instance from API response
- `saveToStorage()` - Saves auth data to localStorage
- `loadFromStorage()` - Retrieves auth data from localStorage
- `clearStorage()` - Clears auth data from localStorage
- `isAuthenticated()` - Checks if user is authenticated
- `getToken()` - Gets the stored auth token

## 🔐 AuthService

The `AuthService` class handles all authentication-related API calls.

### Methods

#### `login(loginData: LoginModel): Promise<AuthResponseModel>`
Authenticates a user with username and password.

**Usage:**
```javascript
import authService from '../../services/AuthService'
import LoginModel from '../../models/LoginModel'

const loginData = LoginModel.fromFormData({ username, password })
const authResponse = await authService.login(loginData)
```

#### `register(registrationData: RegistrationModel): Promise<AuthResponseModel>`
Registers a new user.

**Usage:**
```javascript
import authService from '../../services/AuthService'
import RegistrationModel from '../../models/RegistrationModel'

const registrationData = RegistrationModel.fromFormData({ username, email, password })
const authResponse = await authService.register(registrationData)
```

#### `logout()`
Logs out the current user by clearing authentication data.

**Usage:**
```javascript
authService.logout()
```

#### `isAuthenticated(): boolean`
Checks if a user is currently authenticated.

**Usage:**
```javascript
const isLoggedIn = authService.isAuthenticated()
```

#### `getCurrentUser(): AuthResponseModel | null`
Gets the current user's authentication data.

**Usage:**
```javascript
const user = authService.getCurrentUser()
if (user) {
  console.log(`Logged in as: ${user.username}`)
}
```

#### `getToken(): string | null`
Gets the current JWT token.

**Usage:**
```javascript
const token = authService.getToken()
```

## 🎨 Component Integration

### LoginPage
The login page uses `AuthService` to authenticate users.

**Features:**
- Form validation
- Loading state during authentication
- Error handling and display
- Automatic navigation on success

### RegisterPage
The registration page uses `AuthService` to create new accounts.

**Features:**
- Form validation (username, email, password)
- Loading state during registration
- Error handling and display
- Automatic login and navigation on success

### ProtectedRoute
A wrapper component that protects routes requiring authentication.

**Usage:**
```javascript
import ProtectedRoute from './components/Shared/ProtectedRoute'

<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

This sets the backend API URL. Change it to your production URL when deploying.

### API Configuration

The `api.config.jsx` file contains:
- Base API URL
- Endpoint definitions
- Default headers
- Helper function for authorization headers

## 🔄 Authentication Flow

### Login Flow
1. User enters credentials in `LoginForm`
2. `LoginPage` creates a `LoginModel` from form data
3. `AuthService.login()` is called with the model
4. Service validates data and sends POST request to `/api/auth/login`
5. Backend returns `AuthResponse` with JWT token
6. Token and user data are saved to localStorage
7. User is redirected to home page

### Registration Flow
1. User enters details in `RegisterForm`
2. `RegisterPage` creates a `RegistrationModel` from form data
3. `AuthService.register()` is called with the model
4. Service validates data and sends POST request to `/api/auth/register`
5. Backend creates user and returns `AuthResponse` with JWT token
6. Token and user data are saved to localStorage
7. User is automatically logged in and redirected to home page

### Protected Routes
1. User tries to access a protected route
2. `ProtectedRoute` checks if user is authenticated via `AuthService`
3. If authenticated, render the protected component
4. If not authenticated, redirect to login page

## 🔒 Security Notes

1. **JWT Token Storage**: Tokens are stored in localStorage. For production, consider using httpOnly cookies for enhanced security.

2. **HTTPS**: Always use HTTPS in production to protect tokens during transmission.

3. **Token Expiration**: The backend should implement token expiration. Add token refresh logic as needed.

4. **CORS**: Ensure your backend allows requests from your frontend domain.

## 🚀 Usage Examples

### Making Authenticated API Calls

For other API calls that require authentication, use the `getAuthHeaders()` helper:

```javascript
import { getAuthHeaders } from '../config/api.config'

const response = await fetch('http://localhost:8080/api/notes', {
  method: 'GET',
  headers: getAuthHeaders(),
})
```

### Logout Implementation

Add a logout button in your app:

```javascript
import authService from '../services/AuthService'
import { useNavigate } from 'react-router-dom'

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

## 📦 Dependencies

No additional dependencies are required. The implementation uses:
- Native `fetch` API for HTTP requests
- React hooks (`useState`, `useNavigate`)
- Existing dependencies (framer-motion, react-router-dom)

## ✅ Testing

To test the authentication system:

1. Start your backend server (default: http://localhost:8080)
2. Start the frontend dev server: `npm run dev`
3. Navigate to the register page and create an account
4. You'll be automatically logged in and redirected
5. Try accessing protected routes
6. Test logout functionality
7. Try logging in with the created account

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors, ensure your backend has CORS configured to allow requests from your frontend URL.

### Connection Refused
Make sure your backend server is running on the correct port (default: 8080).

### Invalid Credentials
Check that the username and password match what's in your database.

### Token Not Persisting
Clear your browser's localStorage and try again. Check browser console for errors.
