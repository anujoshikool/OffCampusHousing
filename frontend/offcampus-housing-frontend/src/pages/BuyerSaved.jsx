import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowBack as ArrowBackIcon, 
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { getSavedProperties, toggleSavedProperty, getPropertyDetails } from '../services/BuyerApi';

const GlassCard = styled('div')(({ theme }) => ({
  backdropFilter: 'blur(16px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  borderRadius: '1rem',
  boxShadow: theme.shadows[10],
  padding: theme.spacing(4),
  transition: '0.4s ease all',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[16],
  },
}));

const SavedBadge = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const BuyerSaved = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { firstName } = location.state || {};
  
  const [savedIds, setSavedIds] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSavedProperties = async () => {
      try {
        setLoading(true);
        const response = await getSavedProperties();
        
        if (Array.isArray(response)) {
          setSavedIds(response);
          
          // Fetch details for each property
          const detailsPromises = response.map(id => getPropertyDetails(id));
          const details = await Promise.all(detailsPromises);
          
          // Create a mapping of ID to property details
          const detailsMap = {};
          details.forEach((detail, index) => {
            if (detail) {
              detailsMap[response[index]] = detail;
            }
          });
          
          setPropertyDetails(detailsMap);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading saved properties:', error);
        setError('Failed to load saved properties. Please try again.');
        setLoading(false);
      }
    };

    loadSavedProperties();
  }, []);

  const handleRemoveSaved = async (propertyId) => {
    try {
      await toggleSavedProperty(propertyId);
      setSavedIds(prev => prev.filter(id => id !== propertyId));
      
      // Remove from property details
      setPropertyDetails(prev => {
        const newDetails = {...prev};
        delete newDetails[propertyId];
        return newDetails;
      });
    } catch (error) {
      console.error('Error removing saved property:', error);
      setError('Failed to remove saved property. Please try again.');
    }
  };

  const formatPrice = (price) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-12">
      <div className="flex items-center mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowBackIcon className="mr-2" />
          Back
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {firstName ? `${firstName}'s Saved Properties` : 'My Saved Properties'}
        </h1>
        <p className="text-gray-600">Properties you've saved for later review</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <GlassCard className="text-center py-12">
          <div className="text-red-500 mb-4">{error}</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
            onClick={() => window.location.reload()}
          >
            Try Again
          </motion.button>
        </GlassCard>
      ) : savedIds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedIds.map((propertyId) => {
            const property = propertyDetails[propertyId] || {};
            
            return (
              <motion.div
                key={propertyId}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <GlassCard className="relative">
                  <SavedBadge>
                    <BookmarkIcon fontSize="small" />
                  </SavedBadge>
                  
                  <div className="h-48 mb-4 overflow-hidden rounded-lg">
                    {property.mediaUrls?.[0] ? (
                      <img
                        src={property.mediaUrls[0]}
                        alt={property.title || 'Property image'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <BookmarkBorderIcon className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {property.title || 'Loading property...'}
                  </h2>
                  
                  <p className="text-gray-600 mb-2">
                    {[property.address, property.city, property.state].filter(Boolean).join(', ') || 'Location not available'}
                  </p>
                  
                  <p className="text-indigo-600 font-bold mb-2">
                    {formatPrice(property.priceTotalUnit)}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    {property.bedrooms ? `${property.bedrooms} beds` : ''}
                    {property.bedrooms && property.bathrooms ? ' • ' : ''}
                    {property.bathrooms ? `${property.bathrooms} baths` : ''}
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      onClick={() => navigate(`/buyerProperty/${propertyId}`)}
                    >
                      View Details
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                      onClick={() => handleRemoveSaved(propertyId)}
                    >
                      Remove
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <GlassCard className="text-center py-12">
          <BookmarkBorderIcon className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No saved properties yet</h3>
          <p className="text-gray-600 mb-4">
            Save properties to easily access them later
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            onClick={() => navigate('/properties')}
          >
            Browse Properties
          </motion.button>
        </GlassCard>
      )}
    </div>
  );
};

export default BuyerSaved;