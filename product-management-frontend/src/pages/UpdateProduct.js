import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

function UpdateProduct() {
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', rating: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const navigate = useNavigate();
  const { id } = useParams();

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setForm(res.data);
      } catch (error) {
        showToast('Error fetching product', 'error');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = 'Product name is required';
    if (!form.description?.trim()) newErrors.description = 'Description is required';
    if (!form.category?.trim()) newErrors.category = 'Category is required';
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

    setIsSubmitting(true);
    try {
      await axios.put(`http://localhost:8081/api/products/${id}`, {
        ...form,
        price: parseFloat(form.price),
        rating: parseFloat(form.rating)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      showToast('Product updated successfully!', 'success');
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)' }}>
        <div className="text-center">
          <LoadingSpinner size="xl" color="#f59e0b" />
          <p className="text-gray-600 mt-4 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)' }}>
      <div className="container">
        <Header title="Update Product" />
        
        <div className="glass-card fade-in">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: '#1e293b' }}>Update Product</h2>
              <p className="text-gray-600 mt-2 font-medium">Modify the details of "{form.name}"</p>
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
                  value={form.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter product name"
                  disabled={isSubmitting}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <input 
                  type="text" 
                  value={form.category || ''}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={`form-input ${errors.category ? 'error' : ''}`}
                  placeholder="Enter category"
                  disabled={isSubmitting}
                />
                {errors.category && <div className="form-error">{errors.category}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input 
                  type="number" 
                  value={form.price || ''}
                  onChange={(e) => handleChange('price', e.target.value)}
                  step="0.01"
                  min="0"
                  className={`form-input ${errors.price ? 'error' : ''}`}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
                {errors.price && <div className="form-error">{errors.price}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Rating (0-5)</label>
                <input 
                  type="number" 
                  value={form.rating || ''}
                  onChange={(e) => handleChange('rating', e.target.value)}
                  step="0.1"
                  min="0"
                  max="5"
                  className={`form-input ${errors.rating ? 'error' : ''}`}
                  placeholder="0.0"
                  disabled={isSubmitting}
                />
                {errors.rating && <div className="form-error">{errors.rating}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                value={form.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`form-input ${errors.description ? 'error' : ''}`}
                placeholder="Describe your product..."
                rows="4"
                disabled={isSubmitting}
                style={{ resize: 'vertical', minHeight: '120px' }}
              ></textarea>
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            <div className="flex gap-4 justify-end" style={{ marginTop: '2rem' }}>
              <button 
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-secondary"
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px -2px rgba(245, 158, 11, 0.25)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 8px 16px -4px rgba(245, 158, 11, 0.35)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px -2px rgba(245, 158, 11, 0.25)';
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Updating...
                  </>
                ) : (
                  'Update Product'
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

export default UpdateProduct;