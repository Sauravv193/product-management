import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '', color = 'currentColor' }) => {
  const dimensions = {
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px'
  };

  return (
    <div 
      className={`${className}`}
      style={{
        width: dimensions[size],
        height: dimensions[size],
        border: `2px solid transparent`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        display: 'inline-block'
      }}
    >
    </div>
  );
};

export default LoadingSpinner;