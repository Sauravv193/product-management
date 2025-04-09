import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateProduct() {
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', rating: '' });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => setForm(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8080/api/products/${id}`, form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    navigate('/');
  };

  return (
    <div className="container">
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
        <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
        <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        <input type="number" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} required />
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default UpdateProduct;