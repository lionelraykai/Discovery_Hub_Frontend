import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddressSection = ({ addresses, activeAddress, onAddressChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedAddress = addresses?.find(addr => addr._id === activeAddress) || addresses?.[0];

  return (
    <div className="cart-section">
      <div className="section-header">
        <h2 className="section-title">Shipping Address</h2>
        <Link to="/address" className="section-link">⊕ Add New Address</Link>
      </div>
      <div className="address-grid">
        {selectedAddress ? (
          <div className="address-card active">
            <div className="address-type" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{selectedAddress.isDefault ? 'DEFAULT' : 'ADDRESS'}</span>
              <button 
                onClick={() => setIsModalOpen(true)}
                style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem', color: 'inherit' }}
              >
                Change
              </button>
            </div>
            <h3 className="address-name">{selectedAddress.fullName}</h3>
          </div>
        ) : (
          <p>No addresses found. Please add a new address.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="address-modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1000, 
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(2px)'
        }}>
          <div className="address-modal-content" style={{
            backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', 
            width: '90%', maxWidth: '450px', maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>Select Address</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {addresses && addresses.map((address) => (
                <div 
                  key={address._id}
                  className={`address-card ${activeAddress === address._id ? 'active' : ''}`}
                  onClick={() => {
                    onAddressChange(address._id);
                    setIsModalOpen(false);
                  }}
                  style={{ cursor: 'pointer', margin: 0 }}
                >
                  <div className="address-type">
                    <span>{address.isDefault ? 'DEFAULT' : 'ADDRESS'}</span>
                    {activeAddress === address._id && <span>◎</span>}
                  </div>
                  <h3 className="address-name">{address.fullName}</h3>
                  <p className="address-text" style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem', lineHeight: '1.4' }}>
                    {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}<br />
                    {address.city}, {address.state} {address.postalCode}, {address.country}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSection;
