# Kinotes Authentication Guide

## 🏗️ Architecture Overview

The authentication system is built with a modular, component-based architecture:

```
Authentication Flow
├── Public Routes (No Auth Required)
│   ├── /login → LoginPage → LoginForm
│   └── /register → RegisterPage → RegisterForm
│
└── Protected Routes (Auth Required)
    └── / → ProtectedRoute → HomePage
```

## 📂 Component Structure

### **Shared Components**

#### `InputField.jsx`
Reusable form input component with consistent styling.

**Props:**
- `label` (string) - Field label text
- `type` (string) - Input type (text, email, password)
- `value` (string) - Current input value
- `onChange` (function) - Change handler
- `placeholder` (string) - Placeholder text
- `name` (string) - Input name attribute
- `required` (boolean) - Whether field is required

**Usage:**
```jsx
<InputField
  label="Username"
  type="text"
  name="username"
  value={username}
  onChange={handleChange}
  placeholder="Enter username"
  required
/>
```

#### `ProtectedRoute.jsx`
Route wrapper that checks authentication before rendering children.

**How it works:**
1. Checks `localStorage.getItem('isAuthenticated')`
2. If `true`, renders the protected component
3. If `false`, redirects to `/login`

**Usage:**
```jsx
<Route 
  path="/" 
  element={
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  } 
/>
```

---

### **Login Components**

#### `LoginPage.jsx`
Container component for the login page.

**Features:**
- Centered card layout with gradient background
- Handles login submission
- Stores auth flag in localStorage
- Navigates to home on success

#### `LoginForm.jsx`
Form component with username and password fields.

**Features:**
- Form validation (checks for empty fields)
- Error message display
- Link to registration page
- Console logging for debugging

**Form Fields:**
- Username (text)
- Password (password)

---

### **Register Components**

#### `RegisterPage.jsx`
Container component for the registration page.

**Features:**
- Centered card layout with gradient background
- Handles registration submission
- Shows success alert
- Navigates to login after registration

#### `RegisterForm.jsx`
Form component with username, email, and password fields.

**Features:**
- Comprehensive validation:
  - Empty field checks
  - Email format validation
  - Password length (min. 6 characters)
- Error message display
- Link to login page
- Console logging for debugging

**Form Fields:**
- Username (text)
- Email (email)
- Password (password)

---

## 🔐 Current Authentication Logic

### **Login Flow**
```javascript
// LoginPage.jsx
const handleLogin = (credentials) => {
  console.log('Logging in with:', credentials)
  
  // Simulate authentication
  localStorage.setItem('isAuthenticated', 'true')
  navigate('/')
}
```

### **Registration Flow**
```javascript
// RegisterPage.jsx
const handleRegister = (userData) => {
  console.log('Registering user:', userData)
  
  // Simulate registration
  alert('Registration successful! Please login.')
  navigate('/login')
}
```

### **Logout Flow**
```javascript
// HomePage.jsx
const handleLogout = () => {
  localStorage.removeItem('isAuthenticated')
  navigate('/login')
}
```

### **Route Protection**
```javascript
// ProtectedRoute.jsx
const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

if (!isAuthenticated) {
  return <Navigate to="/login" replace />
}
```

---

## 🎨 Styling Patterns

### **Form Styling**
- White card with rounded corners (`rounded-2xl`)
- Gradient backgrounds (purple/indigo/blue/pink)
- Shadow effects for depth
- Smooth transitions and hover effects

### **Input Styling**
- 2px border with focus state
- Purple accent color (`border-purple-500`)
- Rounded corners (`rounded-xl`)
- Consistent padding (`px-4 py-3`)

### **Button Styling**
- Gradient background (`from-purple-600 to-indigo-600`)
- Hover scale effect (Framer Motion)
- Full width on forms
- Shadow effects

---

## 🔄 State Management

### **Form State**
Each form uses `useState` to manage form data:

```javascript
const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: ''
})

const handleChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: value
  }))
}
```

### **Error State**
```javascript
const [error, setError] = useState('')

// Set error
setError('Please fill in all fields')

// Clear error
setError('')
```

---

## 🚀 Next Steps: Backend Integration

When connecting to a real authentication service (Keycloak/Supabase):

### **1. Replace localStorage with JWT tokens**
```javascript
// Store token
localStorage.setItem('authToken', token)

// Check token validity
const isValidToken = await validateToken(token)
```

### **2. Add API calls**
```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
})

// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
})
```

### **3. Update ProtectedRoute**
```javascript
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken')
      const valid = await validateToken(token)
      setIsAuthenticated(valid)
    }
    checkAuth()
  }, [])
  
  if (isAuthenticated === null) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" />
  
  return children
}
```

### **4. Add Context for Global Auth State**
```javascript
// AuthContext.js
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  
  const login = async (credentials) => {
    const response = await api.login(credentials)
    setUser(response.user)
    localStorage.setItem('authToken', response.token)
  }
  
  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
  }
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

---

## 📋 Validation Rules

### **Login**
- Username: Required, non-empty
- Password: Required, non-empty

### **Registration**
- Username: Required, non-empty
- Email: Required, valid email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Password: Required, minimum 6 characters

---

## 🎯 Key Features

✅ **Modular Components** - Reusable, single-responsibility components  
✅ **Form Validation** - Client-side validation with error messages  
✅ **Smooth Animations** - Framer Motion for page transitions  
✅ **Responsive Design** - Works on all screen sizes  
✅ **Clean Navigation** - React Router for seamless routing  
✅ **Protected Routes** - Authentication guards for secure pages  
✅ **Consistent Styling** - Tailwind CSS utility classes  
✅ **User Feedback** - Error messages and success alerts  

---

## 🐛 Debugging

All authentication actions are logged to the console:

```javascript
// Login attempt
console.log('Logging in with:', { username, password })

// Registration attempt
console.log('Registering user:', { username, email, password })

// Logout
console.log('User logged out')
```

Check the browser console to see authentication flow in action!

---

**Ready for Backend Integration** 🚀
