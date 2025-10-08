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
    <div className="min-h-screen">
      <div className="container">
        <Header title="Product Management" />

        {/* Action Bar */}
        <div className="card">
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
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={() => setShowProductForm(false)}
                className="btn btn-secondary btn-sm"
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

        {/* Products Grid/Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Products ({filteredProducts.length})
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <svg width="48" height="48" className="mx-auto mb-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
              <p className="text-gray-500 text-lg mb-2">No products found</p>
              <p className="text-gray-400 mb-4">Get started by adding your first product</p>
              <button onClick={handleNewProduct} className="btn btn-primary">
                Add Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--gray-50)', borderBottom: '2px solid var(--gray-200)' }}>
                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--gray-700)' }}>Product</th>
                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--gray-700)' }}>Category</th>
                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--gray-700)' }}>Description</th>
                    <th style={{ padding: 'var(--space-4)', textAlign: 'right', fontWeight: 600, color: 'var(--gray-700)' }}>Price</th>
                    <th style={{ padding: 'var(--space-4)', textAlign: 'right', fontWeight: 600, color: 'var(--gray-700)' }}>Rating</th>
                    <th style={{ padding: 'var(--space-4)', textAlign: 'center', fontWeight: 600, color: 'var(--gray-700)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id} style={{ 
                      borderBottom: '1px solid var(--gray-200)',
                      backgroundColor: index % 2 === 0 ? 'white' : 'var(--gray-50)'
                    }}>
                      <td style={{ padding: 'var(--space-4)' }}>
                        <div style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{product.name}</div>
                      </td>
                      <td style={{ padding: 'var(--space-4)', color: 'var(--gray-600)' }}>
                        <span style={{ 
                          backgroundColor: 'var(--primary)', 
                          color: 'white', 
                          padding: 'var(--space-1) var(--space-2)', 
                          borderRadius: 'var(--radius-md)', 
                          fontSize: 'var(--text-xs)',
                          fontWeight: 500
                        }}>
                          {product.category}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-4)', color: 'var(--gray-600)', maxWidth: '200px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.description}
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-4)', textAlign: 'right', fontWeight: 600, color: 'var(--gray-800)' }}>
                        ${product.price.toFixed(2)}
                      </td>
                      <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-1)' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#fbbf24' }}>
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span style={{ color: 'var(--gray-700)', fontWeight: 500 }}>{product.rating}</span>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
                          <button 
                            onClick={() => handleEdit(product)}
                            className="btn btn-sm"
                            style={{ backgroundColor: 'var(--info)', color: 'white' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(product)}
                            className="btn btn-danger btn-sm"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6" />
                              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
