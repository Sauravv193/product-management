import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateProduct() {
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', rating: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8080/api/products', form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    navigate('/');
  };

  return (
    <div className="container">
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} required />
        <input type="text" placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} required />
        <input type="text" placeholder="Category" onChange={e => setForm({...form, category: e.target.value})} required />
        <input type="number" placeholder="Price" onChange={e => setForm({...form, price: e.target.value})} required />
        <input type="number" placeholder="Rating" onChange={e => setForm({...form, rating: e.target.value})} required />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default CreateProduct;