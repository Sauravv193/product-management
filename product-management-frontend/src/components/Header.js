import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, showLogout = true, userEmail }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="glass-card mb-8" style={{ marginBottom: '2rem' }}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          {userEmail && (
            <p className="text-gray-600 text-sm mt-1">Welcome, {userEmail}</p>
          )}
        </div>
        
        {showLogout && (
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="btn btn-danger btn-sm"
              style={{ marginBottom: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;