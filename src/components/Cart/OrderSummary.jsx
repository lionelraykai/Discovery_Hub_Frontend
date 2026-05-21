import React from 'react';

const OrderSummary = ({ subtotal, shipping, estimatedTax, total, buttonText = "CONFIRM & PAY", onAction }) => {
  return (
    <div className="order-summary">
      <h2 className="summary-title">Order Summary</h2>
      <div className="summary-row">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="summary-row">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
      </div>
      <div className="summary-row">
        <span>Estimated Tax</span>
        <span>${estimatedTax.toFixed(2)}</span>
      </div>
      <div className="summary-row total">
        <span>Total</span>
        <span className="total-amount">${total.toFixed(2)}</span>
      </div>
      
      <div className="promo-container">
        <input type="text" className="promo-input" placeholder="CURATED20" />
        <button className="promo-btn">APPLY</button>
      </div>

      <button className="confirm-btn" onClick={onAction}>
        <span>{buttonText}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
      
      <div className="secured-badge">
        <span>🔒</span> Secured by Industry Standard Encryption
      </div>

      <div className="need-help-card">
        <div className="help-icon">🎧</div>
        <div className="help-text">
          <h4>Need help?</h4>
          <p>Talk to an expert curator</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
