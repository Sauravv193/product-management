import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

function CreateProduct() {
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', rating: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.category.trim()) newErrors.category = 'Category is required';
    if (!form.price || parseFloat(form.price) <= 0) newErrors.price = 'Valid price is required';
    if (!form.rating || parseFloat(form.rating) < 0 || parseFloat(form.rating) > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors below', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:8081/api/products', {
        ...form,
        price: parseFloat(form.price),
        rating: parseFloat(form.rating)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      showToast('Product created successfully!', 'success');
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      showToast(error.response?.data?.message || 'Error creating product', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)' }}>
      <div className="container">
        <Header title="Create Product" />
        
        <div className="glass-card fade-in">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: '#1e293b' }}>Create New Product</h2>
              <p className="text-gray-600 mt-2 font-medium">Add a new product to your inventory</p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="btn btn-secondary"
              style={{
                borderRadius: '12px',
                padding: '0.75rem 1rem'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter product name"
                  disabled={isLoading}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <input 
                  type="text" 
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={`form-input ${errors.category ? 'error' : ''}`}
                  placeholder="Enter category"
                  disabled={isLoading}
                />
                {errors.category && <div className="form-error">{errors.category}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input 
                  type="number" 
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  step="0.01"
                  min="0"
                  className={`form-input ${errors.price ? 'error' : ''}`}
                  placeholder="0.00"
                  disabled={isLoading}
                />
                {errors.price && <div className="form-error">{errors.price}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Rating (0-5)</label>
                <input 
                  type="number" 
                  value={form.rating}
                  onChange={(e) => handleChange('rating', e.target.value)}
                  step="0.1"
                  min="0"
                  max="5"
                  className={`form-input ${errors.rating ? 'error' : ''}`}
                  placeholder="0.0"
                  disabled={isLoading}
                />
                {errors.rating && <div className="form-error">{errors.rating}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`form-input ${errors.description ? 'error' : ''}`}
                placeholder="Describe your product..."
                rows="4"
                disabled={isLoading}
                style={{ resize: 'vertical', minHeight: '120px' }}
              ></textarea>
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            <div className="flex gap-4 justify-end" style={{ marginTop: '2rem' }}>
              <button 
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-secondary"
                disabled={isLoading}
                style={{
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem'
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px -2px rgba(59, 130, 246, 0.25)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 8px 16px -4px rgba(59, 130, 246, 0.35)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px -2px rgba(59, 130, 246, 0.25)';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

export default CreateProduct;