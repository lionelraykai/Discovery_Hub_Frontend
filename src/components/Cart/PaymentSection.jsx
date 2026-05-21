import React from 'react';

const PaymentSection = ({ methods, activeMethod, onMethodChange }) => {
  return (
    <div className="cart-section" style={{ marginTop: '2rem' }}>
      <div className="section-header">
        <h2 className="section-title">Payment Details</h2>
      </div>
      <div className="payment-card">
        <div className="payment-tabs" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {methods && methods.map((method) => (
            <button 
              key={method.id}
              className={`payment-tab ${activeMethod === method.paymentMethodId ? 'active' : ''}`}
              onClick={() => onMethodChange(method.paymentMethodId)}
              style={{ 
                padding: '0.75rem 1.25rem', 
                border: activeMethod === method.paymentMethodId ? '2px solid #000' : '1px solid #e0e0e0',
                background: activeMethod === method.paymentMethodId ? '#fafafa' : '#fff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: activeMethod === method.paymentMethodId ? '600' : '400',
                transition: 'all 0.2s ease',
                flex: '1 1 calc(50% - 0.75rem)',
                minWidth: '120px'
              }}
            >
              {method.name}
            </button>
          ))}
        </div>
        
        {activeMethod === 1 && (
          <div className="card-form">
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#666' }}>Cardholder Name</label>
              <input type="text" className="form-input" placeholder="ALEX THOMPSON" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e0e0e0', borderRadius: '4px' }} />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#666' }}>Card Number</label>
              <input type="text" className="form-input" placeholder="**** **** **** 4242" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e0e0e0', borderRadius: '4px' }} />
            </div>
            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#666' }}>Expiry Date</label>
                <input type="text" className="form-input" placeholder="MM / YY" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e0e0e0', borderRadius: '4px' }} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#666' }}>CVV</label>
                <input type="text" className="form-input" placeholder="***" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e0e0e0', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        )}
        
        {activeMethod === 2 && (
          <div style={{ padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '8px', color: '#005ea6', fontSize: '0.9rem' }}>
            <p style={{ margin: 0 }}>You will be redirected to PayPal to complete your purchase securely.</p>
          </div>
        )}
        
        {activeMethod === 3 && (
          <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px', color: '#333', fontSize: '0.9rem' }}>
            <p style={{ margin: 0 }}>You will be redirected to Razorpay's secure checkout page.</p>
          </div>
        )}
        
        {activeMethod === 4 && (
          <div style={{ padding: '1rem', backgroundColor: '#f9fbe7', borderRadius: '8px', color: '#558b2f', fontSize: '0.9rem' }}>
            <p style={{ margin: 0 }}>You will pay in cash to the courier upon delivery of your order.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSection;
