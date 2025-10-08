import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors below', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await axios.post('http://localhost:8081/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      showToast('Login successful! Redirecting...', 'success');
      
      // Small delay for better UX
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data || 
                          'Login failed. Please check your credentials and try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '420px' }}>
        <div className="glass-card fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bounce-in" style={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #8b5cf6 100%)', 
              boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 8px 10px -6px rgba(59, 130, 246, 0.2)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1e293b' }}>Welcome Back</h1>
            <p className="text-gray-600 text-base font-medium">Sign in to manage your products</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                disabled={isLoading}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-full"
              disabled={isLoading}
              style={{ 
                marginTop: '1.5rem', 
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '16px',
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.25), 0 8px 10px -6px rgba(59, 130, 246, 0.2)',
                border: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 15px 10px -6px rgba(59, 130, 246, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.25), 0 8px 10px -6px rgba(59, 130, 246, 0.2)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8 pt-6" style={{ borderTop: '1px solid #e2e8f0' }}>
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-semibold" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#3b82f6',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

export default Login;
