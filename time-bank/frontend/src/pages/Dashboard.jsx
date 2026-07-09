import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingForms, setRatingForms] = useState({});
  const [ratedTransactions, setRatedTransactions] = useState(new Set());

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

  const handleTransactionAction = async (id, action) => {
  try {
    if (action === 'confirm') {
      await api.patch(`/transactions/${id}/confirm`);
    } else {
      await api.patch(`/transactions/${id}/status`, { status: action });
    }
    toast.success('Updated!');
    fetchData();
  } catch (error) {
    toast.error(error.response?.data?.error || 'Action failed');
  }
};

const handleRatingChange = (txId, field, value) => {
  setRatingForms(prev => ({
    ...prev,
    [txId]: { ...prev[txId], [field]: value }
  }));
};

const submitRating = async (tx) => {
  const form = ratingForms[tx.id] || {};
  if (!form.rating) {
    toast.error('Please select a rating');
    return;
  }
  const rated_user_id = tx.requester_id === user?.id ? tx.provider_id : tx.requester_id;
  try {
    await api.post('/ratings', {
      transaction_id: tx.id,
      rated_user_id,
      rating: form.rating,
      comment: form.comment || '',
    });
    toast.success('Rating submitted!');
    setRatedTransactions(prev => new Set(prev).add(tx.id));
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to submit rating');
  }
};

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
                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                     {tx.status === 'pending' && tx.provider_id === user?.id && (
                        <button onClick={() => handleTransactionAction(tx.id, 'accepted')} className="btn-create">
                            Accept
                        </button>
                      )}
                     {tx.status === 'accepted' && (
                       <button onClick={() => handleTransactionAction(tx.id, 'in_progress')} className="btn-create">
                        Start Work
                       </button>
                     )}
                     {tx.status === 'in_progress' && (
                     ((tx.requester_id === user?.id && tx.requester_confirmed) ||
                     (tx.provider_id === user?.id && tx.provider_confirmed)) ? (
                     <span style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
                     Waiting for other party...
                    </span>
                    ) : (
                    <button onClick={() => handleTransactionAction(tx.id, 'confirm')} className="btn-create">
                     Confirm Completion
                    </button>
                   )
                )}
                </div>

               {tx.status === 'completed' && !ratedTransactions.has(tx.id) && (
                  <div style={{ marginTop: '10px', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Rate this exchange:</p>
                 <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                       <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(tx.id, 'rating', star)}
                        style={{
                        fontSize: '22px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: (ratingForms[tx.id]?.rating || 0) >= star ? '#facc15' : '#d1d5db'
                 }}
                   >
                    ★
                     </button>
                 ))}
                </div>
                    <textarea
                    placeholder="Optional comment..."
                    rows="2"
                    style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', marginBottom: '8px' }}
                    value={ratingForms[tx.id]?.comment || ''}
                    onChange={(e) => handleRatingChange(tx.id, 'comment', e.target.value)}
                    />
                    <button onClick={() => submitRating(tx)} className="btn-create">
                    Submit Rating
                    </button>
                </div>
                )}
                {tx.status === 'completed' && ratedTransactions.has(tx.id) && (
                 <p style={{ marginTop: '10px', fontSize: '14px', color: '#059669' }}>✓ Rating submitted</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
