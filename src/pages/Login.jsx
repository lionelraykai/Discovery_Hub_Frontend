import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Loader2, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLoginMutation } from '../hooks/useAuthHooks';
import welcomeVideo from '../assets/AZ2hVmeFS53xd3QBqxNkCQ-AZ2hVmeFN9f21FeMhBl62A.mp4';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const { login: setAuthData, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !showWelcome) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate, showWelcome]);

  const { mutate: login, isPending, error: apiError } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const from = location.state?.from?.pathname || '/';

  const onSubmit = (data) => {
    login(data, {
      onSuccess: (response) => {
        setShowWelcome(true);
        setAuthData(response._id, response.token);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 5000);
      },
    });
  };

  return (
    <div className="auth-page-bg">
      <div className="watermark">ARCHIVE</div>
      
      <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <img src="/logo.png" alt="Knotless Logo" style={{ width: '80px', height: '80px', marginBottom: '1rem', borderRadius: '12px', objectFit: 'contain' }} />
           <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'var(--primary)' }}>Knotless</h1>
           <p className="label-caps" style={{ color: 'var(--on-surface-variant)', fontSize: '0.65rem', letterSpacing: '0.2em' }}>THE TACTILE ARCHIVE</p>
        </div>

        <div className="card-lifted" style={{ 
          maxWidth: '400px', 
          width: '90%', 
          padding: '2rem',
          backgroundColor: 'var(--on-primary)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem' }}>
            Please enter your credentials to access your archive.
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {apiError && (
              <div style={{ color: 'var(--error)', backgroundColor: 'rgba(186, 26, 26, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-default)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {apiError.response?.data?.message || 'Invalid email or password.'}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.7rem' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                style={{ padding: '0.85rem 1rem', fontSize: '0.9rem' }}
                className={errors.email ? 'input-error' : ''}
                {...register('email')}
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                 <label style={{ margin: 0, fontSize: '0.7rem' }}>Password</label>
                 <Link to="#" style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>Forgot?</Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={{ padding: '0.85rem 1rem', fontSize: '0.9rem' }} 
                className={errors.password ? 'input-error' : ''}
                {...register('password')}
              />
              {errors.password && <span className="error-message">{errors.password.message}</span>}
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Login <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} /></>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
             New to the hub? <Link to="/signup" style={{ fontWeight: 600, color: 'var(--on-surface)' }}>Create an account</Link>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '1rem', 
          marginTop: '2rem',
          fontSize: '0.65rem',
          color: 'var(--on-surface-variant)',
          opacity: 0.6
        }}>
           <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
             🛡️ <span style={{ fontSize: '9px' }}>SECURE</span>
           </span>
           <span>•</span>
           <span>© 2026 KNOTLESS</span>
           <span>•</span>
           <Link to="#" className="nav-link" style={{ fontSize: '0.65rem' }}>PRIVACY</Link>
           <Link to="#" className="nav-link" style={{ fontSize: '0.65rem' }}>TERMS</Link>
        </div>

      </div>

      {showWelcome && (
        <div className="welcome-overlay">
          <video 
            src={welcomeVideo} 
            autoPlay 
            muted 
            loop
            playsInline 
            className="welcome-video-bg"
          />
          <div className="welcome-content">
            <div className="pulse-icon">
              <Check size={36} color="var(--primary)" />
            </div>
            <h2>Welcome</h2>
            <p>Accessing your archive...</p>
          </div>
        </div>
      )}
    </div>
  );
}
