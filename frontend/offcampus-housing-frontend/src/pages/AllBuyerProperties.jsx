import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBuyerProperties } from '../services/BuyerApi';
import BuyerNavbar from '../components/BuyerNavbar';
import { motion } from 'framer-motion';
import { 
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const PropertyCard = ({ property, toggleFavorite, toggleSaved, favorites, saved, navigate }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col"
  >
    {/* Image */}
    <div className="relative">
      {property.mediaUrls?.[0] ? (
        <img
          src={property.mediaUrls[0]}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <FavoriteBorderIcon className="text-gray-400" />
        </div>
      )}
      <div className="absolute top-2 right-2 flex space-x-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.propertyId);
          }}
          className="p-1 bg-white rounded-full shadow-md"
        >
          {favorites.includes(property.propertyId) ? (
            <FavoriteIcon className="text-red-500" fontSize="small" />
          ) : (
            <FavoriteBorderIcon className="text-gray-500" fontSize="small" />
          )}
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleSaved(property.propertyId);
          }}
          className="p-1 bg-white rounded-full shadow-md"
        >
          {saved.includes(property.propertyId) ? (
            <BookmarkIcon className="text-blue-500" fontSize="small" />
          ) : (
            <BookmarkBorderIcon className="text-gray-500" fontSize="small" />
          )}
        </button>
      </div>
    </div>

    {/* Details */}
    <div className="p-4 flex flex-col flex-1">
      <h2 className="text-lg font-semibold text-gray-800 mb-1 hover:text-indigo-600 transition-colors">
        {property.title}
      </h2>
      <p className="text-gray-600 text-sm mb-2">
        {[property.address, property.city, property.state].filter(Boolean).join(', ')}
      </p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-indigo-600 font-bold text-lg">
          ${property.priceTotalUnit?.toLocaleString()}
        </span>
        <span className="text-gray-500 text-sm">
          {property.listingType === 'WHOLE_UNIT' ? '/month' : ''}
        </span>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        {property.bedrooms} beds • {property.bathrooms} baths
      </div>
      <div className="flex items-center text-sm mb-4">
        <span className={`w-2 h-2 rounded-full mr-2 ${property.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <span className={`${property.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-600'}`}>
          {property.status}
        </span>
      </div>

      {/* View Details Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(`/buyerProperty/${property.propertyId}`)}
        className="mt-auto bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-indigo-700 transition"
      >
        View Details
      </motion.button>
    </div>
  </motion.div>
);

const AllProperties = () => {
  const navigate = useNavigate();
  const propertiesPerPage = 6;

  const [filters, setFilters] = useState({
    searchQuery: '',
    type: '',
    priceRange: [0, 10000000],
    status: '',
    bedrooms: '',
    bathrooms: ''
  });

  const [sortOption, setSortOption] = useState('newest');
  const [sortDirection, setSortDirection] = useState('desc');
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [sortedProperties, setSortedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [favorites, setFavorites] = useState(() => {
    try {
      const storedFavorites = localStorage.getItem('buyerFavorites');
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error('Error parsing favorites:', error);
      return [];
    }
  });

  const [saved, setSaved] = useState(() => {
    try {
      const storedSaved = localStorage.getItem('buyerSaved');
      return storedSaved ? JSON.parse(storedSaved) : [];
    } catch (error) {
      console.error('Error parsing saved properties:', error);
      return [];
    }
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getAllBuyerProperties();
        setProperties(response);
        setFilteredProperties(response);
        setSortedProperties(response);
      } catch (error) {
        console.error('Fetch properties error:', error);
        setErrorMessage('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const applyFilters = () => {
    const filtered = properties.filter(property => {
      const matchesSearch = !filters.searchQuery || 
        property.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const matchesType = !filters.type || property.listingType === filters.type;
      const matchesStatus = !filters.status || property.status === filters.status;
      const matchesBedrooms = !filters.bedrooms || property.bedrooms >= filters.bedrooms;
      const matchesBathrooms = !filters.bathrooms || property.bathrooms >= filters.bathrooms;
      const matchesPrice = property.priceTotalUnit >= filters.priceRange[0] && 
                         property.priceTotalUnit <= filters.priceRange[1];

      return matchesSearch && matchesType && matchesStatus && 
             matchesBedrooms && matchesBathrooms && matchesPrice;
    });

    setFilteredProperties(filtered);
    setCurrentPage(1);
  };

  const applySorting = () => {
    const sorted = [...filteredProperties].sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      switch (sortOption) {
        case 'price': return (a.priceTotalUnit - b.priceTotalUnit) * direction;
        case 'date': return (new Date(a.createdAt) - new Date(b.createdAt)) * direction;
        case 'title': return a.title.localeCompare(b.title) * direction;
        case 'status': return (a.status || '').localeCompare(b.status || '') * direction;
        default: return (new Date(b.createdAt) - new Date(a.createdAt)) * direction;
      }
    });
    
    setSortedProperties(sorted);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id];
      
      try {
        localStorage.setItem('buyerFavorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
      
      return newFavorites;
    });
  };

  const toggleSaved = (id) => {
    setSaved(prev => {
      const newSaved = prev.includes(id)
        ? prev.filter(sId => sId !== id)
        : [...prev, id];
      
      try {
        localStorage.setItem('buyerSaved', JSON.stringify(newSaved));
      } catch (error) {
        console.error('Error saving saved properties:', error);
      }
      
      return newSaved;
    });
  };

  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  useEffect(() => {
    applySorting();
  }, [sortOption, sortDirection, filteredProperties]);

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = sortedProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const handleSortChange = (option) => {
    if (sortOption === option) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      setSortDirection('desc');
    }
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      type: '',
      priceRange: [0, 10000000],
      status: '',
      bedrooms: '',
      bathrooms: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <BuyerNavbar/>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            All Properties
          </h1>
          <p className="text-gray-600">Browse our selection of available properties</p>
        </motion.div>

        {/* Search and Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search properties by title or address..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              />
            </div>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-3 rounded-lg font-medium ${showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filters
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={applyFilters}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Search
              </motion.button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Property Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <option value="">All Types</option>
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                    <option value="Room">Room</option>
                    <option value="Whole">Whole Unit</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">All Statuses</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="PENDING">Pending</option>
                    <option value="SOLD">Sold</option>
                    <option value="RENTED">Rented</option>
                  </select>
                </div>

                {/* Bedrooms Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms (min)</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.bedrooms}
                    onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Bathrooms Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms (min)</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.bathrooms}
                    onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      placeholder="Min Price"
                      className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters({ ...filters, priceRange: [Number(e.target.value), filters.priceRange[1]] })}
                      min="0"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max Price"
                      className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                      min={filters.priceRange[0]}
                    />
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex items-end space-x-3 sm:col-span-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={applyFilters}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Apply Filters
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetFilters}
                    className="flex items-center px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Reset
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results and Sorting Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredProperties.length}</span> properties
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Sort by:</span>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSortChange('newest')}
                className={`px-3 py-2 text-sm rounded-lg flex items-center ${sortOption === 'newest' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <span>Newest</span>
                {sortOption === 'newest' && (
                  sortDirection === 'asc' ? (
                    <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSortChange('price')}
                className={`px-3 py-2 text-sm rounded-lg flex items-center ${sortOption === 'price' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <span>Price</span>
                {sortOption === 'price' && (
                  sortDirection === 'asc' ? (
                    <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSortChange('title')}
                className={`px-3 py-2 text-sm rounded-lg flex items-center ${sortOption === 'title' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <span>Title</span>
                {sortOption === 'title' && (
                  sortDirection === 'asc' ? (
                    <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSortChange('status')}
                className={`px-3 py-2 text-sm rounded-lg flex items-center ${sortOption === 'status' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <span>Status</span>
                {sortOption === 'status' && (
                  sortDirection === 'asc' ? (
                    <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : errorMessage ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading properties</h3>
                <div className="mt-2 text-sm text-red-700">
                  {errorMessage}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="mt-3 inline-flex items-center text-sm font-medium text-red-700 hover:text-red-600"
                >
                  <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Try again
                </motion.button>
              </div>
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FavoriteBorderIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No properties found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {properties.length === 0 
                ? "No properties available in the market."
                : "No properties match your current filters."}
            </p>
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reset Filters
              </motion.button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProperties.map((property) => (
                <PropertyCard
                  key={property.propertyId}
                  property={property}
                  toggleFavorite={toggleFavorite}
                  toggleSaved={toggleSaved}
                  favorites={favorites}
                  saved={saved}
                  navigate={navigate}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {filteredProperties.length > propertiesPerPage && (
              <div className="mt-12 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstProperty + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastProperty, filteredProperties.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredProperties.length}</span> results
                  </p>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Previous
                  </motion.button>
                  {Array.from({ length: Math.ceil(filteredProperties.length / propertiesPerPage) }, (_, index) => (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 border text-sm font-medium rounded-md ${currentPage === index + 1 ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      {index + 1}
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredProperties.length / propertiesPerPage), p + 1))}
                    disabled={currentPage === Math.ceil(filteredProperties.length / propertiesPerPage)}
                    className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${currentPage === Math.ceil(filteredProperties.length / propertiesPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllProperties;