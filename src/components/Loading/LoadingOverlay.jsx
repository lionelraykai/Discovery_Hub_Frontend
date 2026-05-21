import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-backdrop"></div>
      <div className="loading-content">
        <div className="loading-visual">
          <div className="loading-circle pulse-1"></div>
          <div className="loading-circle pulse-2"></div>
          <div className="loading-icon-box">
            <span className="material-symbols-outlined loading-icon">auto_awesome</span>
          </div>
        </div>
        <div className="loading-text-container">
            <h2 className="loading-message">{message}</h2>
            <div className="loading-bar">
                <div className="loading-bar-progress"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
