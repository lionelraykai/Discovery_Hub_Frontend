import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../hooks/useUserHooks';
import { useAuth } from '../context/AuthContext';
import { Edit2, Calendar, ChevronUp, MessageSquare, LogOut, X } from 'lucide-react';
import ProfileSkeleton from '../components/skeletons/ProfileSkeleton.jsx';

export default function Profile() {
  const { data, isLoading, error } = useProfile();
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2 style={{ color: 'var(--error)' }}>Error loading profile</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  const { user, stats, contributions } = data;

  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="container" style={{ paddingBottom: 'var(--spacing-12)' }}>
      {/* Profile Header */}
      <div style={{ textAlign: 'center', margin: '4rem 0' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
          <img 
            src={user.avatar || null} 
            alt={user.name} 
            style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--surface-container-high)' }} 
          />
          <Link 
            to="/profile/edit" 
            style={{ 
              position: 'absolute', 
              bottom: '5px', 
              right: '5px', 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              padding: '0.5rem', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <Edit2 size={16} />
          </Link>
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', fontWeight: 600 }}>{user.name}</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
          {user.bio || 'Architectural designer focused on functional minimalism and sustainable urban living.'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'var(--on-surface-variant)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          <Calendar size={16} />
          <span>MEMBER SINCE {formattedDate.toUpperCase()}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/profile/edit" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Edit Profile
          </Link>
          <button 
            onClick={() => setShowLogoutConfirm(true)} 
            className="btn-secondary" 
            style={{ padding: '0.75rem 2rem', border: '1px solid var(--surface-variant)' }}
          >
            <LogOut size={18} style={{ marginRight: '0.5rem' }} />
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(26, 28, 25, 0.4)', 
          backdropFilter: 'blur(8px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 2000 
        }}>
          <div className="card-lifted" style={{ maxWidth: '400px', width: '90%', textAlign: 'center', padding: '2.5rem' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--surface-container-low)', borderRadius: '50%' }}>
                <LogOut size={32} color="var(--primary)" />
              </div>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quit the Collective?</h2>
            <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              Are you sure you want to log out? Your contributions will remain, but you will need to sign back in to add new knots.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button onClick={handleLogout} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Yes, Log Me Out
              </button>
              <button onClick={() => setShowLogoutConfirm(false)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '1.5rem', 
        marginBottom: '4rem' 
      }}>
        <div className="card-lifted" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{stats.problemsSolved}</h3>
          <p className="label-caps" style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', letterSpacing: '0.1em' }}>PROBLEMS SOLVED</p>
        </div>
        <div className="card-lifted" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{stats.totalUpvotes >= 1000 ? (stats.totalUpvotes / 1000).toFixed(1) + 'k' : stats.totalUpvotes}</h3>
          <p className="label-caps" style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', letterSpacing: '0.1em' }}>TOTAL UPVOTES</p>
        </div>
        <div className="card-lifted" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{stats.knowledgeContributions}</h3>
          <p className="label-caps" style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', letterSpacing: '0.1em' }}>KNOWLEDGE CONTRIBUTIONS</p>
        </div>
      </div>

      {/* Contributions Section */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Your Contributions</h2>
        <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.05em' }}>VIEW ALL</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {contributions && contributions.length > 0 ? (
          contributions.map(knot => (
            <Link 
              key={knot._id} 
              to={`/knot/${knot._id}`} 
              className="card-lifted" 
              style={{ 
                display: 'flex', 
                gap: '2rem', 
                padding: '1.5rem', 
                textDecoration: 'none', 
                color: 'inherit',
                alignItems: 'center'
              }}
            >
              {knot.image && (
                <div style={{ width: '240px', height: '140px', borderRadius: '0.75rem', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={knot.image} alt={knot.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="status-pill" style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem' }}>{knot.category?.toUpperCase() || 'GENERAL'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                    {new Date(knot.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>{knot.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: 1.5, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {knot.excerpt}
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                    <ChevronUp size={16} />
                    <span>{knot.votes}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                    <MessageSquare size={16} />
                    <span>{knot.solutions?.length || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--surface-container-low)', borderRadius: '1rem' }}>
            <p style={{ color: 'var(--on-surface-variant)' }}>No contributions yet. Start sharing your quiet wisdom.</p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div style={{ textAlign: 'center', marginTop: '6rem', opacity: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/logo.png" alt="Knotless Logo" style={{ width: '40px', height: '40px', marginBottom: '0.5rem', borderRadius: '6px', objectFit: 'contain' }} />
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Knotless</h2>
        <p className="label-caps" style={{ fontSize: '0.6rem', letterSpacing: '0.2em' }}>
          {user.name.toUpperCase()} © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
