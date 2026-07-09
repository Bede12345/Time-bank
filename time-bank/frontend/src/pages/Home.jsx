import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await api.get('/offers');
      setOffers(response.data.offers || []);
    } catch (error) {
      toast.error('Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Time-Bank</h1>
          <p>Trade skills and time - no money involved!</p>
          {!isAuthenticated ? (
            <div className="hero-buttons">
              <Link to="/register" className="btn-hero-primary">Get Started</Link>
              <Link to="/login" className="btn-hero-secondary">Login</Link>
            </div>
          ) : (
            <div className="hero-welcome">
              Welcome back, {user?.full_name}!<br />
              <span>You have {user?.time_credits} time credits</span>
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <div className="section-header">
            <h2>Available Offers</h2>
            {isAuthenticated && (
              <Link to="/create-offer" className="btn-create-offer">+ Create Offer</Link>
            )}
          </div>

          {loading ? (
            <div className="loading">Loading offers...</div>
          ) : offers.length === 0 ? (
            <div className="no-offers">No offers available yet</div>
          ) : (
            <div className="offers-grid">
              {offers.map((offer) => (
                <div key={offer.id} className="offer-card">
                  <div className="offer-header">
                    <h3 className="offer-title">{offer.title}</h3>
                    <span className={'offer-type-badge ' + (offer.type === 'offer' ? 'offer' : 'request')}>
                      {offer.type === 'offer' ? 'Offer' : 'Request'}
                    </span>
                  </div>
                  <p className="offer-description">{offer.description}</p>
                  <div className="offer-meta">
                    <span>By: {offer.username}</span>
                    <span>{offer.credits_per_hour} credits/hour</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={'offer-status ' + (offer.status === 'open' ? 'open' : 'closed')}>
                      {offer.status}
                    </span>
                    {isAuthenticated && offer.user_id !== user?.id && offer.status === 'open' && (
                      <Link to={/offer/} className="offer-link">View Details →</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
