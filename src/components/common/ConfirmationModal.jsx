import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) {
  if (!isOpen) return null;

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
      zIndex: 3000,
      padding: '1.5rem',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div className="card-lifted" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2.5rem',
        backgroundColor: 'var(--on-primary)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}
        >
          <X size={20} />
        </button>

        <div style={{ 
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: type === 'danger' ? 'rgba(186, 26, 26, 0.1)' : 'rgba(23, 52, 29, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: type === 'danger' ? 'var(--error)' : 'var(--primary)'
        }}>
          <AlertCircle size={32} />
        </div>

        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--on-surface)' }}>{title}</h3>
        <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn-secondary" 
            onClick={onClose} 
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {cancelText}
          </button>
          <button 
            className={type === 'danger' ? 'btn-primary' : 'btn-primary'} 
            onClick={onConfirm} 
            style={{ 
              flex: 1, 
              justifyContent: 'center',
              backgroundColor: type === 'danger' ? 'var(--error)' : 'var(--primary)',
              background: type === 'danger' ? 'var(--error)' : undefined
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
