import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TreasurerPanel from './TreasurerPanel';
import MemberPanel from './MemberPanel';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout, isTreasurer } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    try {
      const response = await api.get('/contributions/my-contributions');
      setContributions(response.data.contributions);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600">
                Role: {user?.role === 'treasurer' ? 'Treasurer' : 'Member'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Treasurer Panel - Only visible to treasurers */}
          {isTreasurer() && (
            <div className="mb-8">
              <TreasurerPanel />
            </div>
          )}

          {/* Member Panel - Visible to all members */}
          <MemberPanel 
            contributions={contributions}
            onContributionAdded={fetchContributions}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
