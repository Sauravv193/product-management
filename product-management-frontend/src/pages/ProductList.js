import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    maxRating: ''
  });
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    rating: ''
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, productId: null, productName: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter products based on search term and filters
  useEffect(() => {
    let filtered = [...products];
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const fetchProducts = async (filterParams = {}) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8081/api/products', {
        headers: { Authorization: `Bearer ${token}` },
        params: filterParams
      });
      setProducts(res.data);
      showToast(`Loaded ${res.data.length} products`, 'success');
    } catch (err) {
      console.error('Failed to fetch products:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        showToast('Failed to load products', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const validateProductForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.category.trim()) newErrors.category = 'Category is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.price || parseFloat(form.price) <= 0) newErrors.price = 'Valid price is required';
    if (!form.rating || parseFloat(form.rating) < 0 || parseFloat(form.rating) > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProductForm()) {
      showToast('Please fix the errors below', 'error');
      return;
    }

    const productData = {
      ...form,
      price: parseFloat(form.price),
      rating: parseFloat(form.rating)
    };

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (editId) {
        await axios.put(`http://localhost:8081/api/products/${editId}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Product updated successfully!', 'success');
      } else {
        await axios.post('http://localhost:8081/api/products', productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Product created successfully!', 'success');
      }

      // Reset form
      setForm({ name: '', category: '', description: '', price: '', rating: '' });
      setEditId(null);
      setShowProductForm(false);
      setErrors({});
      fetchProducts();
    } catch (err) {
      console.error('Error submitting product:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const errorMessage = err.response?.data?.message || 'Failed to save product';
        showToast(errorMessage, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyFilters = () => {
    // Apply server-side filtering if needed
    fetchProducts(filters);
    showToast('Filters applied', 'info');
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      maxRating: ''
    });
    setSearchTerm('');
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      rating: product.rating.toString()
    });
    setEditId(product.id);
    setShowProductForm(true);
    setErrors({});
  };

  const handleDeleteClick = (product) => {
    setConfirmDialog({
      show: true,
      productId: product.id,
      productName: product.name
    });
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/api/products/${confirmDialog.productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Product deleted successfully', 'success');
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        showToast('Failed to delete product', 'error');
      }
    } finally {
      setConfirmDialog({ show: false, productId: null, productName: '' });
    }
  };

  const handleNewProduct = () => {
    setForm({ name: '', category: '', description: '', price: '', rating: '' });
    setEditId(null);
    setShowProductForm(true);
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)' }}>
      <div className="container">
        <Header title="Product Management" />

        {/* Action Bar */}
        <div className="glass-card fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  placeholder="Search products..."
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3e%3cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\'/%3e%3c/svg%3e")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px',
                    paddingRight: '40px'
                  }}
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-secondary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
                </svg>
                Filters
              </button>
              <button 
                onClick={handleNewProduct}
                className="btn btn-primary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Product
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="slide-up" style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--gray-200)' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="form-input"
                    placeholder="Filter by category"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      type="number"
                      className="form-input"
                      placeholder="Min"
                    />
                    <input
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      type="number"
                      className="form-input"
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Rating Range</label>
                  <div className="flex gap-2">
                    <input
                      name="minRating"
                      value={filters.minRating}
                      onChange={handleFilterChange}
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      className="form-input"
                      placeholder="Min"
                    />
                    <input
                      name="maxRating"
                      value={filters.maxRating}
                      onChange={handleFilterChange}
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      className="form-input"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2" style={{ marginTop: 'var(--space-4)' }}>
                <button onClick={applyFilters} className="btn btn-primary btn-sm">
                  Apply Filters
                </button>
                <button onClick={clearFilters} className="btn btn-secondary btn-sm">
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="glass-card slide-up">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {editId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-gray-600">
                  {editId ? 'Update the details of your product' : 'Fill in the information to create a new product'}
                </p>
              </div>
              <button 
                onClick={() => setShowProductForm(false)}
                className="btn btn-secondary btn-sm"
                style={{ flexShrink: 0 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter product name"
                    disabled={isSubmitting}
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className={`form-input ${errors.category ? 'error' : ''}`}
                    placeholder="Enter category"
                    disabled={isSubmitting}
                  />
                  {errors.category && <div className="form-error">{errors.category}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleFormChange}
                    type="number"
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
                    name="rating"
                    value={form.rating}
                    onChange={handleFormChange}
                    type="number"
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
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className={`form-input ${errors.description ? 'error' : ''}`}
                  placeholder="Enter product description"
                  rows="3"
                  disabled={isSubmitting}
                  style={{ resize: 'vertical', minHeight: '80px' }}
                />
                {errors.description && <div className="form-error">{errors.description}</div>}
              </div>

              <div className="flex gap-4 justify-end" style={{ marginTop: 'var(--space-6)' }}>
                <button 
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      {editId ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editId ? 'Update Product' : 'Create Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Section */}
        <div className="glass-card fade-in">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Your Products
              </h2>
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M7 8h10M7 12h10M7 16h4" />
                </svg>
                Grid View
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 fade-in">
              <svg width="64" height="64" className="mx-auto mb-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No products found</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first product to your collection</p>
              <button onClick={handleNewProduct} className="btn btn-primary btn-lg bounce-in">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="product-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div style={{ padding: 'var(--space-6)' }}>
                    {/* Product Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ lineHeight: '1.3' }}>{product.name}</h3>
                        <div className="product-badge">{product.category}</div>
                      </div>
                      <div className="price-tag">${product.price.toFixed(2)}</div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.5',
                      minHeight: '4.5rem'
                    }}>
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="rating-stars mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          width="18" 
                          height="18" 
                          viewBox="0 0 24 24" 
                          fill={star <= Math.floor(product.rating) ? 'currentColor' : 'none'}
                          stroke={star <= Math.floor(product.rating) ? 'none' : 'currentColor'}
                          strokeWidth="1"
                          className={star <= Math.floor(product.rating) ? 'star-filled' : 'text-gray-300'}
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <span className="text-gray-700 font-semibold ml-2">{product.rating}/5</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="btn btn-secondary btn-sm flex-1"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(product)}
                        className="btn btn-danger btn-sm flex-1"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6" />
                          <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.show}
        title="Delete Product"
        message={`Are you sure you want to delete "${confirmDialog.productName}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ show: false, productId: null, productName: '' })}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

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

export default ProductList;
