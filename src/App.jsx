import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import LoginRequiredModal from './components/LoginRequiredModal';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './pages/Home';
import KnotDetail from './pages/KnotDetail';
import PostKnot from './pages/PostKnot';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import BlogsFeed from './pages/BlogsFeed';
import BlogDetail from './pages/BlogDetail';
import CreateBlog from './pages/CreateBlog';
import DraftsFeed from './pages/DraftsFeed';
import ScrollToTop from './components/ScrollToTop';

import './App.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to home and pass state to open the modal
    return <Navigate to="/" state={{ triggerModal: true, from: location }} replace />;
  }

  return children;
}

function MainLayout() {
  const { isLoginModalOpen, closeLoginModal, openLoginModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.triggerModal) {
      openLoginModal();
      // Clear the state so it doesn't reopen on every navigation
      window.history.replaceState({}, document.title);
    }
  }, [location, openLoginModal]);

  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <LoginRequiredModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout (with Nav) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/knot/:id" element={<KnotDetail />} />
            
            <Route path="/blogs" element={<BlogsFeed />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/drafts" element={<DraftsFeed />} />

            {/* Protected Route */}
            <Route 
              path="/post-blog" 
              element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post" 
              element={
                <ProtectedRoute>
                  <PostKnot />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/edit" 
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Auth Layout (No Nav) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
