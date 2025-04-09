import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (filterParams = {}) => {
    try {
      const res = await axios.get('http://localhost:8081/api/products/filter', {
        params: filterParams
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Separate change handlers
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...form,
      price: parseFloat(form.price),
      rating: parseFloat(form.rating)
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:8081/api/products/${editId}`, productData);
        alert('Product updated successfully');
      } else {
        await axios.post('http://localhost:8081/api/products', productData);
        alert('Product created successfully');
      }

      setForm({ name: '', category: '', description: '', price: '', rating: '' });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error('Error submitting product:', err);
      alert('Failed to submit product');
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProducts(filters);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      rating: product.rating
    });
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product');
    }
  };

  return (
    <div className="container">
      <h2>Product Management</h2>
      <button onClick={handleLogout}>Logout</button>

      {/* Filter Form */}
      <form onSubmit={handleFilter} style={{ marginBottom: '20px' }}>
        <input
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          placeholder="Category"
        />
        <input
          name="minPrice"
          value={filters.minPrice}
          onChange={handleFilterChange}
          type="number"
          placeholder="Min Price"
        />
        <input
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          type="number"
          placeholder="Max Price"
        />
        <input
          name="minRating"
          value={filters.minRating}
          onChange={handleFilterChange}
          type="number"
          step="0.1"
          placeholder="Min Rating"
        />
        <input
          name="maxRating"
          value={filters.maxRating}
          onChange={handleFilterChange}
          type="number"
          step="0.1"
          placeholder="Max Rating"
        />
        <button type="submit">Apply Filters</button>
      </form>

      {/* Product Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          name="name"
          value={form.name}
          onChange={handleFormChange}
          placeholder="Name"
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleFormChange}
          placeholder="Category"
          required
        />
        <input
          name="description"
          value={form.description}
          onChange={handleFormChange}
          placeholder="Description"
          required
        />
        <input
          name="price"
          value={form.price}
          onChange={handleFormChange}
          type="number"
          placeholder="Price"
          required
        />
        <input
          name="rating"
          value={form.rating}
          onChange={handleFormChange}
          type="number"
          step="0.1"
          placeholder="Rating"
          required
        />
        <button type="submit">{editId ? 'Update' : 'Create'} Product</button>
      </form>

      {/* Product Table */}
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.description}</td>
              <td>${p.price}</td>
              <td>{p.rating}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
