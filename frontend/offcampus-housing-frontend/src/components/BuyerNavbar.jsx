import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, HeartIcon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const BuyerNavbar = ({ firstName, lastName, email }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/api/buyer-properties')}
        >
          <HomeIcon className="h-8 w-8 text-blue-600 mr-2" />
          <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-500 bg-clip-text">
            Campus Nest
          </span>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-semibold text-gray-800">{firstName} {lastName}</span>
            <span className="text-sm text-gray-500">{email}</span>
          </div>
          <button>
            <UserCircleIcon 
              className="h-10 w-10 hover:text-red-600 text-blue-500" 
              onClick={() => navigate('/auth/profile')}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BuyerNavbar;