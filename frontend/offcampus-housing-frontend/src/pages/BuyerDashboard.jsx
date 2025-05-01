import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BuyerProfile from '../components/BuyerProfile';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { firstName, userType } = location.state || {};

  const handleViewAllProperties = () => {
    navigate('/allProperties', { state: { firstName, userType } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Luxe Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Branding Perfection */}
            <div className="flex items-center space-x-4">
              <img 
                src="/logo_outline1.png" 
                alt="Campus Nest"
                className="w-14 h-14 object-contain opacity-95 hover:opacity-100 transition-opacity duration-200"
              />
              <div className="flex flex-col border-l border-gray-200 dark:border-gray-600 pl-4">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
                  Campus Nest
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-light">
                  Your home away from home
                </p>
              </div>
            </div>

            {/* User Context */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleViewAllProperties}
                className="px-4 py-2 rounded-lg bg-indigo-50 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-gray-600 text-indigo-600 dark:text-indigo-300 text-sm font-medium transition-all"
              >
                🏠 View Properties
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Homely Welcome, <span className="font-medium">{firstName || 'Guest'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Canvas */}
      <main className="max-w-7xl mx-auto p-4">
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-gray-100 dark:border-gray-700 p-4">
          <BuyerProfile />
        </section>
      </main>
    </div>
  );
};

export default BuyerDashboard;