import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';

// Contexto de autenticação
import { AuthProvider } from './contexts/AuthContext';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MyWishlists from './pages/MyWishlists';
import WishlistDetail from './pages/WishlistDetail';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Componentes
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <AuthProvider value={{ user }}>
      <Router>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/home" /> : <Register />} />
          
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/my-wishlists" element={
              <ProtectedRoute>
                <MyWishlists />
              </ProtectedRoute>
            } />
            <Route path="/wishlist/:id" element={<WishlistDetail />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
