import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, showLogout = true, userEmail }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="glass-card mb-8 slide-up" style={{ marginBottom: '2rem' }}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #8b5cf6 100%)', 
            boxShadow: '0 4px 12px -2px rgba(59, 130, 246, 0.3)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1e293b' }}>{title}</h1>
            {userEmail && (
              <p className="text-gray-600 text-sm mt-1 font-medium">Welcome back, {userEmail}</p>
            )}
          </div>
        </div>
        
        {showLogout && (
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="btn btn-sm"
              style={{ 
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px -2px rgba(239, 68, 68, 0.25)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                marginBottom: 0
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 8px 16px -4px rgba(239, 68, 68, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px -2px rgba(239, 68, 68, 0.25)';
              }}
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