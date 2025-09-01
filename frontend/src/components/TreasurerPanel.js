import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TreasurerPanel = () => {
  const [pendingContributions, setPendingContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchPendingContributions();
    fetchStats();
  }, []);

  const fetchPendingContributions = async () => {
    try {
      const response = await api.get('/contributions/pending');
      setPendingContributions(response.data.contributions);
    } catch (error) {
      console.error('Error fetching pending contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/contributions/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (contributionId) => {
    try {
      await api.put(`/contributions/${contributionId}/approve`);
      fetchPendingContributions();
      fetchStats();
    } catch (error) {
      console.error('Error approving contribution:', error);
    }
  };

  const handleDecline = async (contributionId) => {
    try {
      await api.put(`/contributions/${contributionId}/decline`);
      fetchPendingContributions();
      fetchStats();
    } catch (error) {
      console.error('Error declining contribution:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Treasurer Panel Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Treasurer Panel
        </h2>
        <p className="text-blue-700">
          Review and approve pending contributions from members.
        </p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat._id} className="bg-white shadow rounded-lg p-6">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {stat._id || 'Unknown'}
              </div>
              <div className="mt-2 flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {stat.count}
                </div>
                <div className="ml-2 text-sm text-gray-600">
                  contributions
                </div>
              </div>
              {stat.totalAmount && (
                <div className="mt-1 text-sm text-gray-600">
                  Total: ${stat.totalAmount.toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pending Contributions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Pending Contributions ({pendingContributions.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {pendingContributions.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No pending contributions to review.
            </div>
          ) : (
            pendingContributions.map((contribution) => (
              <div key={contribution._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {contribution.userId?.firstName?.charAt(0) || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {contribution.userId?.firstName} {contribution.userId?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {contribution.userId?.email}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {contribution.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted: {new Date(contribution.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ${contribution.amount.toFixed(2)}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contribution.status)}`}>
                        {contribution.status}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(contribution._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecline(contribution._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TreasurerPanel;
