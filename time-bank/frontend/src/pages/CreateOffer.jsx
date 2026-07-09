import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreateOffer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Education',
    type: 'offer',
    credits_per_hour: 1,
    is_remote: true,
    location: '',
  });

  const categories = [
    'Technology', 'Education', 'Home Services', 
    'Creative', 'Health', 'Business', 'Other'
  ];

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' 
      ? e.target.checked 
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/offers', formData);
      toast.success('Offer created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-offer-page">
      <div className="container">
        <h1>Create New Offer</h1>
        
        <form className="create-offer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              rows="4"
              required
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Type *</label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
              >
                <option value="offer">Offer (I can provide)</option>
                <option value="request">Request (I need)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Credits per Hour *</label>
            <input
              type="number"
              name="credits_per_hour"
              required
              min="1"
              max="100"
              value={formData.credits_per_hour}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. New York, Online, etc."
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="is_remote"
              checked={formData.is_remote}
              onChange={handleChange}
            />
            <label>Remote / Online</label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="btn-create" disabled={loading}>
              {loading ? 'Creating...' : 'Create Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOffer;
