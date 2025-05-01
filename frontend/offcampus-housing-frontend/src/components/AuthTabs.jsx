import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthTabs = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (location.state?.showLogin) {
      setActiveTab('login');
    }
  }, [location.state]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1505843513577-22bb7d21e455?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwaG91c2V8ZW58MHx8MHx8fDA%3D')",
          opacity: 1.0,
          filter: 'brightness(0.85) saturate(1.1)',
        }}
      />

      {/* Auth Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Branding Side */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-indigo-700 to-purple-900 text-white p-8 flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-sm animate-fade-in-up">
              CampusNest
            </h1>
            <p className="text-md opacity-80 tracking-wide">
              Your home away from home
            </p>
          </div>

          
            <p className="text-medium leading-relaxed opacity-90">
              Discover curated listings, personalized matches, and a seamless renting journey—all in one place.
            </p>
            <div className="flex items-center gap-2 text-indigo-200">
            <svg
              className="w-14 h-14 text-indigo-300 drop-shadow-lg animate-pulse-slow align-center"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              >
            <path d="M12 3L3 12H21L12 3Z" /> {/* Roof */}
            <path d="M6 12V21H18V12" />      {/* House body */}
            <path d="M13 15H11V21" />        {/* Door */}
            <path d="M8 15H10V17" />         {/* Window left */}
            <path d="M14 15H16V17" />        {/* Window right */}
            </svg>
              <span className="text-sm tracking-wide">
                Find your dream space
              </span>
            </div>
          

          <p className="text-xs text-indigo-200 mt-6 tracking-wider opacity-60">
            © 2025 CampusNest. All rights reserved.
          </p>
        </div>

        {/* Forms Side */}
        <div className="w-full md:w-7/12 flex flex-col">
          {/* Tabs */}
          <div className="flex">
            <button
              className={`flex-1 py-3 text-md font-semibold transition-all ${
                activeTab === 'login'
                  ? 'text-indigo-700 border-b-4 border-indigo-700 bg-indigo-50'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-3 text-md font-semibold transition-all ${
                activeTab === 'register'
                  ? 'text-indigo-700 border-b-4 border-indigo-700 bg-indigo-50'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            {activeTab === 'login' ? (
              <LoginForm setActiveTab={setActiveTab} />
            ) : (
              <RegisterForm setActiveTab={setActiveTab} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTabs;
