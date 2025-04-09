import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';

function AddProduct() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    rating: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productService.createProduct(product);
      navigate('/products');
    } catch (error) {
      alert('Error creating product');
    }
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={product.description} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input type="text" name="category" value={product.category} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <input type="number" name="rating" value={product.rating} onChange={handleChange} required />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;