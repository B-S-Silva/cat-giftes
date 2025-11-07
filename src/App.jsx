import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

// Páginas
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import MyWishlists from './pages/MyWishlists'
import WishlistDetail from './pages/WishlistDetail'
import ProfileModern from './pages/ProfileModern'
import NotFound from './pages/NotFound'

// Componentes
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-wishlists"
              element={
                <ProtectedRoute>
                  <MyWishlists />
                </ProtectedRoute>
              }
            />
            <Route path="/wishlist/:id" element={<WishlistDetail />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileModern />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
