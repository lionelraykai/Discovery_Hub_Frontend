import { X, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginRequiredModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleSignUp = () => {
    onClose();
    navigate('/signup');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(26, 28, 25, 0.45)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1.5rem'
    }}>
      <div className="card-lifted" style={{
        maxWidth: '960px',
        width: '100%',
        margin: 'auto',
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        padding: 0,
        backgroundColor: 'var(--on-primary)',
        height: 'min(640px, 90vh)'
      }}>
        {/* Left Side: Image & Quote */}
        <div className="hidden-mobile" style={{
          flex: 1,
          position: 'relative',
          backgroundImage: 'url("https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=600&h=800")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '3rem'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <img src="/logo.png" alt="Knotless Logo" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: 0 }}>Knotless</h2>
            </div>
            <hr style={{ width: '40px', border: '1px solid white', opacity: 0.5, marginBottom: '4rem' }} />
            
            <p style={{ fontSize: '1.75rem', lineHeight: 1.4, fontStyle: 'italic', fontFamily: 'var(--font-display)', marginBottom: '1.5rem', color: 'white' }}>
              "Simplicity is the ultimate sophistication."
            </p>
            <p className="label-caps" style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em', fontSize: '0.7rem' }}>THE COLLECTIVE PHILOSOPHY</p>
          </div>
        </div>

        {/* Right Side: Content */}
        <div style={{
          flex: 1.2,
          padding: 'clamp(2rem, 5vw, 4rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}
          >
            <X size={24} />
          </button>

          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Join the Collective</h2>
          <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.7, marginBottom: '2.5rem', fontSize: '1.1rem' }}>
            We invite you to participate. Posting new knots and upvoting solutions are reserved for our community of craftspeople and designers.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            <button className="btn-primary" onClick={handleSignUp} style={{ width: '100%', justifyContent: 'space-between', padding: '1.15rem 1.5rem' }}>
              Sign Up <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" onClick={handleLogin} style={{ width: '100%', justifyContent: 'center', padding: '1.15rem 1.5rem' }}>
              Login to Account
            </button>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
            {[
              "Save your favorite archives",
              "Collaborate on tactile knots",
              "Access exclusive category insights"
            ].map((feature, i) => (
              <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--on-surface)' }}>
                <Check size={16} color="var(--primary)" /> {feature}
              </li>
            ))}
          </ul>

          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Maybe later, I'm just browsing
          </button>
        </div>
      </div>
    </div>
  );
}
