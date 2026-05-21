import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, Menu, X, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useUserHooks';

export default function Navigation() {
  const { user, logout, openLoginModal, isAuthenticated } = useAuth();
  const { data } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handlePostClick = () => {
    setDrawerOpen(false);
    if (user) {
      navigate('/post');
    } else {
      openLoginModal();
    }
  };

  return (
    <>
      <nav className="glass-nav">
        <div className="container nav-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Left Side: Logo + Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <img src="/logo.png" alt="Knotless Logo" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.02em', color: 'var(--primary)' }}>
                Knotless
              </span>
            </Link>
            <div className="nav-links hidden-mobile" style={{ display: 'flex', gap: '2rem' }}>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} style={{ fontWeight: isActive('/') ? 700 : 500 }}>Home</Link>
              <Link to="/blogs" className={`nav-link ${isActive('/blogs') ? 'active' : ''}`} style={{ fontWeight: isActive('/blogs') ? 700 : 500 }}>Blogs</Link>
              <Link to="/drafts" className={`nav-link ${isActive('/drafts') ? 'active' : ''}`} style={{ fontWeight: isActive('/drafts') ? 700 : 500 }}>Drafts</Link>
            </div>
          </div>
          
          {/* Right Side: Actions */}
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            
            <button 
              type="button" 
              className="btn-primary hidden-mobile" 
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', fontWeight: 500 }}
              onClick={handlePostClick}
            >
              Post a Knot
            </button>
            
            <button type="button" className="hidden-mobile" style={{ background: 'none', padding: '0.5rem', color: 'var(--primary)', border: 'none', cursor: 'pointer' }}>
              <Bell size={20} className="icon-stroke" />
            </button>
            
            <div className="hidden-mobile">
              {isAuthenticated ? (
                <div style={{ cursor: 'pointer', position: 'relative' }} onClick={() => navigate('/profile')} title="View Profile">
                  <img 
                    src={data?.user?.avatar || null}
                    alt={data?.user?.name || 'User'} 
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                </div>
              ) : (
                <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                  <User size={18} />
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile-Only Toggle */}
            <button 
              className="hidden-desktop" 
              style={{ background: 'none', padding: '0.5rem', color: 'var(--primary)', cursor: 'pointer', border: 'none' }}
              onClick={() => setDrawerOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }} onClick={() => setDrawerOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} style={{ fontSize: '1.25rem' }} onClick={() => setDrawerOpen(false)}>Home</Link>
          <Link to="/blogs" className={`nav-link ${isActive('/blogs') ? 'active' : ''}`} style={{ fontSize: '1.25rem' }} onClick={() => setDrawerOpen(false)}>Blogs</Link>
          <Link to="/drafts" className={`nav-link ${isActive('/drafts') ? 'active' : ''}`} style={{ fontSize: '1.25rem' }} onClick={() => setDrawerOpen(false)}>Drafts</Link>
          
          <hr style={{ border: 'none', borderTop: '1px solid var(--surface-container-high)', margin: '1rem 0' }} />

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handlePostClick}>
            Post a Knot
          </button>

          {!isAuthenticated ? (
            <Link to="/login" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setDrawerOpen(false)}>
              Sign In
            </Link>
          ) : (
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={logout}>
              Sign Out
            </button>
          )}
        </div>
      </div>
    </>
  );
}
