import React from 'react';

const Skeleton = ({ width, height, circle, className = '', style = {} }) => {
  const baseStyle = {
    width: width || '100%',
    height: height || '1rem',
    borderRadius: circle ? '50%' : 'var(--radius-default)',
    ...style
  };

  return (
    <div 
      className={`skeleton ${className}`} 
      style={baseStyle}
    ></div>
  );
};

export default Skeleton;
