import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`loading-spinner ${className}`} style={{
      width: size === 'sm' ? '16px' : size === 'lg' ? '32px' : '24px',
      height: size === 'sm' ? '16px' : size === 'lg' ? '32px' : '24px'
    }}>
    </div>
  );
};

export default LoadingSpinner;