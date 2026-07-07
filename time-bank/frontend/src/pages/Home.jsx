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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold mb-4">Time-Bank</h1>
          <p className="text-xl mb-8">Trade skills and time - no money involved!</p>
          {!isAuthenticated ? (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Login
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-lg">Welcome back, {user?.full_name}!</p>
              <p className="text-sm opacity-90">You have {user?.time_credits} time credits</p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Available Offers</h2>
          {isAuthenticated && (
            <Link
              to="/create-offer"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Create Offer
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading offers...</div>
        ) : offers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No offers available yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{offer.title}</h3>
                  <span className={'px-2 py-1 rounded text-xs font-semibold ' + (offer.type === 'offer' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>
                    {offer.type === 'offer' ? 'Offer' : 'Request'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By: {offer.username}</span>
                  <span>{offer.credits_per_hour} credits/hour</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className={'text-xs px-2 py-1 rounded ' + (offer.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>
                    {offer.status}
                  </span>
                  {isAuthenticated && offer.user_id !== user?.id && offer.status === 'open' && (
                    <Link
                      to={/offer/}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
