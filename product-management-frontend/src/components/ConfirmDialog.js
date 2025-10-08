import React from 'react';

const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'danger' // 'danger', 'warning', 'info'
}) => {
  if (!isOpen) return null;

  const typeClasses = {
    danger: 'btn-danger',
    warning: 'btn-warning',
    info: 'btn-primary'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in" 
         style={{
           position: 'fixed',
           top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           backgroundColor: 'rgba(0, 0, 0, 0.6)',
           backdropFilter: 'blur(4px)',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           zIndex: 1000,
           padding: '1rem'
         }}>
      <div className="glass-card bounce-in" style={{ 
        maxWidth: '420px', 
        width: '100%', 
        margin: 0,
        animation: 'bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
            background: type === 'danger' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                       type === 'warning' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                       'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: type === 'danger' ? '0 4px 12px -2px rgba(239, 68, 68, 0.3)' :
                      type === 'warning' ? '0 4px 12px -2px rgba(245, 158, 11, 0.3)' :
                      '0 4px 12px -2px rgba(59, 130, 246, 0.3)'
          }}>
            {type === 'danger' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            )}
            {type === 'warning' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            )}
            {type === 'info' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1" style={{ color: '#1e293b' }}>{title}</h3>
            <p className="text-gray-600 font-medium">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onCancel}
            className="btn"
            style={{
              background: '#ffffff',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#9ca3af';
              e.target.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.color = '#6b7280';
            }}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className="btn"
            style={{
              background: type === 'danger' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                         type === 'warning' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                         'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              boxShadow: type === 'danger' ? '0 4px 12px -2px rgba(239, 68, 68, 0.25)' :
                        type === 'warning' ? '0 4px 12px -2px rgba(245, 158, 11, 0.25)' :
                        '0 4px 12px -2px rgba(59, 130, 246, 0.25)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = type === 'danger' ? '0 8px 16px -4px rgba(239, 68, 68, 0.35)' :
                                        type === 'warning' ? '0 8px 16px -4px rgba(245, 158, 11, 0.35)' :
                                        '0 8px 16px -4px rgba(59, 130, 246, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = type === 'danger' ? '0 4px 12px -2px rgba(239, 68, 68, 0.25)' :
                                        type === 'warning' ? '0 4px 12px -2px rgba(245, 158, 11, 0.25)' :
                                        '0 4px 12px -2px rgba(59, 130, 246, 0.25)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;