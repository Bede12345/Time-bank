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
    return <div className="loading">Loading...</div>;
  }

  const getStatusClass = (status) => {
    const statusMap = {
      'open': 'open',
      'matched': 'matched',
      'completed': 'completed',
      'pending': 'pending',
      'accepted': 'accepted',
      'in_progress': 'in_progress',
      'disputed': 'disputed',
      'cancelled': 'cancelled'
    };
    return statusMap[status] || 'default';
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-stats">
          <div className="stat-item">
            <div className="stat-label">Credits</div>
            <div className="stat-value">{user?.time_credits || 0}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Rating</div>
            <div className="stat-value">{user?.rating_average?.toFixed(1) || 'N/A'}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">My Offers</div>
            <div className="stat-value">{offers.length}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Transactions</div>
            <div className="stat-value">{transactions.length}</div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>My Offers</h2>
          {offers.length === 0 ? (
            <p className="dashboard-empty">You haven't created any offers yet.</p>
          ) : (
            offers.map(offer => (
              <div key={offer.id} className="offer-item">
                <div className="offer-info">
                  <h3>{offer.title}</h3>
                  <p>{offer.category} • {offer.credits_per_hour} credits/hour</p>
                </div>
                <span className={'status-badge ' + getStatusClass(offer.status)}>
                  {offer.status}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-section">
          <h2>Transactions</h2>
          {transactions.length === 0 ? (
            <p className="dashboard-empty">No transactions yet.</p>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="transaction-item">
                <div className="tx-header">
                  <div>
                    <div className="tx-title">{tx.offer_title}</div>
                    <div className="tx-users">{tx.requester_username} ↔ {tx.provider_username}</div>
                    <div className="tx-details">{tx.hours_estimated} hours • {tx.credits_held} credits</div>
                  </div>
                  <span className={'status-badge ' + getStatusClass(tx.status)}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
