import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors below', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      await axios.post('http://localhost:8081/api/auth/signup', {
        email: formData.email,
        password: formData.password
      });
      
      showToast('Account created successfully! Redirecting to login...', 'success');
      
      // Small delay for better UX
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data || 
                          'Signup failed. Please try again.';
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
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)', 
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3), 0 8px 10px -6px rgba(16, 185, 129, 0.2)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="m22 21-3-3" />
                <path d="m16 16 3 3" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1e293b' }}>Create Account</h1>
            <p className="text-gray-600 text-base font-medium">Join us to manage your products</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
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

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-full"
              disabled={isLoading}
              style={{ 
                marginTop: '1.5rem', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '16px',
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.25), 0 8px 10px -6px rgba(16, 185, 129, 0.2)',
                border: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(16, 185, 129, 0.4), 0 15px 10px -6px rgba(16, 185, 129, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.25), 0 8px 10px -6px rgba(16, 185, 129, 0.2)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8 pt-6" style={{ borderTop: '1px solid #e2e8f0' }}>
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#10b981',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#059669'}
                onMouseLeave={(e) => e.target.style.color = '#10b981'}
              >
                Sign in here
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

export default Signup;
