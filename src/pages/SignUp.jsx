import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Info, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSignupMutation } from '../hooks/useAuthHooks';
import { useAuth } from '../context/AuthContext';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { mutate: signup, isPending, error: apiError } = useSignupMutation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data) => {
    const { name, email, password } = data;
    signup({ name, email, password }, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  return (
    <div className="split-layout">
      {/* Left Column: Mission & Branding */}
      <div className="split-left" style={{ padding: '3rem 10%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4rem' }}>
        <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <img src="/logo.png" alt="Knotless Logo" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'contain' }} />
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary)', margin: 0 }}>Knotless</h1>
        </div>
          
          <div style={{ maxWidth: '480px' }}>
            <p style={{ fontSize: '1rem', color: 'var(--on-surface)', marginBottom: '0.75rem', fontWeight: 500 }}>
              Join the tactile archive of quiet wisdom.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
              A dedicated space for architects, designers, and enthusiasts to solve knots with intentionality and rustic minimalism.
            </p>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <img 
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800&h=600" 
            alt="Bright minimal interior" 
            style={{ width: '100%', height: 'auto', maxHeight: '200px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', bottom: '-1.5rem', left: '0', fontSize: '0.6rem', color: 'var(--on-surface-variant)', letterSpacing: '0.2em', opacity: 0.5 }}>
            EST. 2026 / TOKYO — OSLO
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="split-right" style={{ padding: '2rem 5%' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <header style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Create Account</h2>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>Begin your journey in our curated community.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)}>
            {apiError && (
              <div style={{ color: 'var(--error)', backgroundColor: 'rgba(186, 26, 26, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-default)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {apiError.response?.data?.message || 'Something went wrong during signup.'}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.65rem' }}>Full Name</label>
              <input 
                type="text" 
                placeholder="E.g. Hiroshi Andersson" 
                style={{ padding: '0.7rem 1rem' }} 
                className={errors.name ? 'input-error' : ''}
                {...register('name')}
              />
              {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.65rem' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                style={{ padding: '0.7rem 1rem' }} 
                className={errors.email ? 'input-error' : ''}
                {...register('email')}
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>
            
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.65rem' }}>Create Password</label>
              <input 
                type="password" 
                placeholder="Min. 6 characters" 
                style={{ padding: '0.7rem 1rem' }} 
                className={errors.password ? 'input-error' : ''}
                {...register('password')}
              />
              {errors.password && <span className="error-message">{errors.password.message}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.65rem' }}>Confirm Password</label>
              <input 
                type="password" 
                placeholder="Repeat password" 
                style={{ padding: '0.7rem 1rem' }} 
                className={errors.confirmPassword ? 'input-error' : ''}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              padding: '0.75rem', 
              backgroundColor: 'var(--surface-container-low)', 
              borderRadius: 'var(--radius-default)',
              marginBottom: '1rem'
            }}>
                <Info size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.75rem', color: '#62665c', lineHeight: 1.4, margin: 0 }}>
                  Clarify, respect silence, and contribute authentic knowledge.
                </p>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>
             Already have an account? <Link to="/login" style={{ fontWeight: 600, color: 'var(--on-surface)' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
