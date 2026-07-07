import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [offersRes, transactionsRes] = await Promise.all([
        api.get('/offers/my'),
        api.get('/transactions')
      ]);
      setOffers(offersRes.data.offers || []);
      setTransactions(transactionsRes.data.transactions || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-sm opacity-75">Credits</p>
              <p className="text-2xl font-bold">{user?.time_credits || 0}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Rating</p>
              <p className="text-2xl font-bold">{user?.rating_average?.toFixed(1) || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">My Offers</p>
              <p className="text-2xl font-bold">{offers.length}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Transactions</p>
              <p className="text-2xl font-bold">{transactions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Offers</h2>
          {offers.length === 0 ? (
            <p className="text-gray-500">You haven't created any offers yet.</p>
          ) : (
            <div className="space-y-4">
              {offers.map(offer => (
                <div key={offer.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{offer.title}</h3>
                    <p className="text-sm text-gray-500">{offer.category} • {offer.credits_per_hour} credits/hour</p>
                  </div>
                  <span className={'px-2 py-1 rounded text-sm ' + (
                    offer.status === 'open' ? 'bg-green-100 text-green-800' :
                    offer.status === 'matched' ? 'bg-yellow-100 text-yellow-800' :
                    offer.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  )}>
                    {offer.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <div className="space-y-4">
              {transactions.map(tx => (
                <div key={tx.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{tx.offer_title}</p>
                      <p className="text-sm text-gray-500">
                        {tx.requester_username} ↔ {tx.provider_username}
                      </p>
                      <p className="text-sm text-gray-500">{tx.hours_estimated} hours • {tx.credits_held} credits</p>
                    </div>
                    <span className={'px-2 py-1 rounded text-sm ' + (
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      tx.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      tx.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                      tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    )}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
