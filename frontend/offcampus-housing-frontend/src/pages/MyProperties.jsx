import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPropertiesBySeller, deleteProperty } from '../services/SellerApi';
import { 
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import SellerNavbar from '../components/SellerNavbar';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [sortedProperties, setSortedProperties] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();

  const userData = location.state || {};

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
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      setErrorMessage('');
      try {
        const response = await getPropertiesBySeller();
        if (response && response.length > 0) {
          setProperties(response);
          setFilteredProperties(response);
          setSortedProperties(response);
        }
      } catch (error) {
        setErrorMessage(error.message || 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  useEffect(() => {
    applySorting();
  }, [sortOption, sortDirection, filteredProperties]);

  const applyFilters = () => {
    let filtered = [...properties];

    if (filters.searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(property => property.listingType === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(property => property.status === filters.status);
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= filters.bedrooms);
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= filters.bathrooms);
    }

    filtered = filtered.filter(property =>
      property.priceTotalUnit >= filters.priceRange[0] &&
      property.priceTotalUnit <= filters.priceRange[1]
    );

    setFilteredProperties(filtered);
    setCurrentPage(1);
  };

  const applySorting = () => {
    const sorted = [...filteredProperties].sort((a, b) => {
      switch (sortOption) {
        case 'price':
          return sortDirection === 'asc' 
            ? a.priceTotalUnit - b.priceTotalUnit 
            : b.priceTotalUnit - a.priceTotalUnit;
        case 'date':
          return sortDirection === 'asc'
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        case 'title':
          return sortDirection === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case 'status':
          return sortDirection === 'asc'
            ? (a.status || '').localeCompare(b.status || '')
            : (b.status || '').localeCompare(a.status || '');
        default: // 'newest'
          return sortDirection === 'asc'
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    setSortedProperties(sorted);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleSortChange = (option) => {
    if (sortOption === option) {
      toggleSortDirection();
    } else {
      setSortOption(option);
      setSortDirection('desc'); // Default to descending when changing sort option
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
    setFilteredProperties(properties);
    setSortOption('newest');
    setSortDirection('desc');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty(propertyId);
        // Remove the deleted property from state
        setProperties(properties.filter(property => property.propertyId !== propertyId));
        setFilteredProperties(filteredProperties.filter(property => property.propertyId !== propertyId));
        setSortedProperties(sortedProperties.filter(property => property.propertyId !== propertyId));
      } catch (error) {
        setErrorMessage('Failed to delete property: ' + error.message);
      }
    }
  };

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = sortedProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBackToDashboard = () => {
    navigate('/api/seller-properties', { state: userData });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerNavbar userData={userData} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackToDashboard}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Home
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Properties
            </h1>
            <p className="mt-1 text-gray-600">
              Manage your property listings and view performance
            </p>
          </div>
          <button
            onClick={() => navigate('/add-property')}
            className="mt-4 md:mt-0 flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-700 transition-all"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Property
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search properties by title or address..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2.5 rounded-lg font-medium text-sm ${showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
              <button
                onClick={applyFilters}
                className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                Search
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms (min)</label>
                  <select
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms (min)</label>
                  <select
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      placeholder="Min Price"
                      className="flex-1 p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters({ ...filters, priceRange: [Number(e.target.value), filters.priceRange[1]] })}
                    />
                    <span className="text-gray-500 text-sm">to</span>
                    <input
                      type="number"
                      placeholder="Max Price"
                      className="flex-1 p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                    />
                  </div>
                </div>

                <div className="flex items-end space-x-3 sm:col-span-2">
                  <button
                    onClick={applyFilters}
                    className="flex-1 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetFilters}
                    className="flex items-center px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 text-sm"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-2" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-3 md:space-y-0">
          <p className="text-gray-600 text-sm">
            Showing <span className="font-semibold">{filteredProperties.length}</span> properties
          </p>
          <div className="flex items-center space-x-3">
            <span className="text-gray-600 text-sm">Sort by:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleSortChange('newest')}
                className={`px-3 py-1.5 text-xs rounded-lg flex items-center ${sortOption === 'newest' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <span>Newest</span>
                {sortOption === 'newest' && (
                  sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3 ml-1" /> : <ArrowDownIcon className="h-3 w-3 ml-1" />
                )}
              </button>
              <button
                onClick={() => handleSortChange('price')}
                className={`px-3 py-1.5 text-xs rounded-lg flex items-center ${sortOption === 'price' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <span>Price</span>
                {sortOption === 'price' && (
                  sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3 ml-1" /> : <ArrowDownIcon className="h-3 w-3 ml-1" />
                )}
              </button>
              <button
                onClick={() => handleSortChange('title')}
                className={`px-3 py-1.5 text-xs rounded-lg flex items-center ${sortOption === 'title' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <span>Title</span>
                {sortOption === 'title' && (
                  sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3 ml-1" /> : <ArrowDownIcon className="h-3 w-3 ml-1" />
                )}
              </button>
              <button
                onClick={() => handleSortChange('status')}
                className={`px-3 py-1.5 text-xs rounded-lg flex items-center ${sortOption === 'status' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <span>Status</span>
                {sortOption === 'status' && (
                  sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3 ml-1" /> : <ArrowDownIcon className="h-3 w-3 ml-1" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : errorMessage ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading properties</h3>
                <div className="mt-1 text-sm text-red-700">
                  {errorMessage}
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 inline-flex items-center text-sm font-medium text-red-700 hover:text-red-600"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <ClipboardDocumentListIcon className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-base font-medium text-gray-900">No properties found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {properties.length === 0 
                ? "You haven't listed any properties yet."
                : "No properties match your current filters."}
            </p>
            <div className="mt-4">
              <button
                onClick={() => properties.length === 0 ? navigate('/add-property') : resetFilters()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                {properties.length === 0 ? 'Add Your First Property' : 'Reset Filters'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentProperties.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-100">
                  <div className="relative h-40 bg-gray-100 flex items-center justify-center">
                    {property.mediaUrl ? (
                      <img 
                        src={property.mediaUrl} 
                        alt={property.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400" />
                    )}
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      property.status === 'Available' ? 'bg-green-100 text-green-800' :
                      property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      property.status === 'Sold' || property.status === 'Rented' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {property.status || 'Not Available'}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1">
                        {property.title}
                      </h2>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {property.listingType}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                      {property.address}, {property.city}, {property.state}
                    </p>

                    <div className="mt-3 flex items-center text-xs text-gray-500 space-x-3">
                      <div className="flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.bedrooms || 'N/A'} beds
                      </div>
                      <div className="flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {property.bathrooms || 'N/A'} baths
                      </div>
                      <div className="flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {property.squareFootage ? `${property.squareFootage} sqft` : 'N/A'}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-base font-bold text-gray-900">
                        {formatPrice(property.priceTotalUnit)}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/myProperties/${property.propertyId}`)}
                          className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.propertyId)}
                          className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredProperties.length > propertiesPerPage && (
              <div className="mt-8 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
                <div>
                  <p className="text-xs text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstProperty + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastProperty, filteredProperties.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredProperties.length}</span> results
                  </p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border border-gray-300 rounded-md text-xs font-medium ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.ceil(filteredProperties.length / propertiesPerPage) }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-1 border text-xs font-medium rounded-md ${currentPage === index + 1 ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredProperties.length / propertiesPerPage)}
                    className={`px-3 py-1 border border-gray-300 rounded-md text-xs font-medium ${currentPage === Math.ceil(filteredProperties.length / propertiesPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyProperties;