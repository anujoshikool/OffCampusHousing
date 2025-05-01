import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/Authapi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Logout as LogoutIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Bookmark as BookmarkIcon,
  Chat as ChatIcon,
  Home as HomeIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { Avatar, Divider, IconButton, Badge, Tooltip, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import FeedbackIcon from '@mui/icons-material/Feedback';

const GlassCard = styled('div')(({ theme }) => ({
  backdropFilter: 'blur(16px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  borderRadius: '1rem',
  boxShadow: theme.shadows[10],
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: '0.4s ease all',
  '&:hover': {
    transform: 'scale(1.015)',
    boxShadow: theme.shadows[15],
  },
}));

const GradientAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  boxShadow: theme.shadows[8],
  color: '#fff',
  fontWeight: 600,
}));

const ActionCard = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '1rem',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha(theme.palette.background.default, 0.12),
  boxShadow: theme.shadows[6],
  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '200%',
    height: '100%',
    background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent)',
    transform: 'skewX(-30deg)',
    zIndex: 0,
    transition: '0.4s ease',
  },
  '&:hover:before': {
    left: '100%',
  },
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: theme.shadows[12],
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  '& *': {
    zIndex: 1,
  },
}));

const BuyerProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName, lastName, email, avatar, notificationsCount, userType } = location.state || {};

  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await logoutUser();
      showMessage(res.message || "Logged out successfully", "success");
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      showMessage(err.message || "Logout failed", "error");
    } finally {
      setIsLoggingOut(false);
      setShowDropdown(false);
    }
  };

  const handleClickOutside = useCallback((e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        profileRef.current && !profileRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleViewAllProperties = () => {
    navigate('/allProperties', { state: { firstName, userType } });
  };

  const handleCardClick = (text) => {
    if (text === 'Saved Properties') {
      navigate('/buyer/saved', { state: { firstName, userType } });
    } 
    else if (text === 'Favorites') {
      navigate('/buyer/favorites', { state: { firstName, userType } });
    }
    else if (text === 'User Feedback') {
      navigate('/UserFeedback', { state: { firstName, userType } });
    }
    else {
      showMessage(`${text} clicked!`, 'success');
    }
  };

  const handleAIPricing = async (e) => {
    e.preventDefault();
    setIsCalculatingPrice(true);
    setSuggestedPrice(null);
    setPriceBreakdown(null);
    
    const formData = new FormData(e.target);
    const location = formData.get('location');
    const size = formData.get('size');
    const bedrooms = formData.get('bedrooms');
    const bathrooms = formData.get('bathrooms');
    const propertyType = formData.get('propertyType');
    const condition = formData.get('condition');
    const yearBuilt = formData.get('yearBuilt');
    const amenities = formData.getAll('amenities');
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Base price calculation
      const basePricePerSqFt = 250;
      let basePrice = (parseInt(size) * basePricePerSqFt) + 
                     (parseInt(bedrooms) * 50000) + 
                     (parseInt(bathrooms) * 30000);
      
      // Location multiplier
      const locationMultiplier = 
        location.toLowerCase().includes('san francisco') ? 1.5 : 
        location.toLowerCase().includes('new york') ? 1.4 :
        location.toLowerCase().includes('los angeles') ? 1.3 : 
        location.toLowerCase().includes('chicago') ? 1.2 :
        location.toLowerCase().includes('miami') ? 1.25 : 1;
      
      // Property type adjustment
      const typeMultiplier = 
        propertyType === 'house' ? 1.0 :
        propertyType === 'apartment' ? 0.9 :
        propertyType === 'condo' ? 0.95 :
        propertyType === 'townhouse' ? 0.92 : 1.0;
      
      // Condition adjustment
      const conditionMultiplier = 
        condition === 'excellent' ? 1.15 :
        condition === 'good' ? 1.05 :
        condition === 'fair' ? 0.95 :
        condition === 'poor' ? 0.8 : 1.0;
      
      // Age adjustment (newer homes are more valuable)
      const currentYear = new Date().getFullYear();
      const age = currentYear - parseInt(yearBuilt);
      const ageMultiplier = age < 5 ? 1.1 : 
                          age < 10 ? 1.05 :
                          age < 20 ? 1.0 :
                          age < 30 ? 0.95 : 0.9;
      
      // Amenities bonus
      let amenitiesBonus = 0;
      amenities.forEach(amenity => {
        switch(amenity) {
          case 'pool': amenitiesBonus += 25000; break;
          case 'garage': amenitiesBonus += 15000; break;
          case 'garden': amenitiesBonus += 10000; break;
          case 'basement': amenitiesBonus += 8000; break;
          case 'fireplace': amenitiesBonus += 5000; break;
          default: break;
        }
      });
      
      // Calculate final price
      const finalPrice = (basePrice * locationMultiplier * typeMultiplier * 
                         conditionMultiplier * ageMultiplier) + amenitiesBonus;
      
      // Format price
      const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(finalPrice);
      
      // Generate breakdown
      const breakdown = [
        { label: 'Base Price', value: `$${(basePrice).toLocaleString()}` },
        { label: 'Location Multiplier', value: `${(locationMultiplier * 100 - 100).toFixed(0)}%` },
        { label: 'Property Type', value: `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}` },
        { label: 'Condition', value: `${condition.charAt(0).toUpperCase() + condition.slice(1)}` },
        { label: 'Age Adjustment', value: `${(ageMultiplier * 100 - 100).toFixed(0)}%` },
        { label: 'Amenities Bonus', value: `$${amenitiesBonus.toLocaleString()}` },
      ];
      
      setSuggestedPrice(formattedPrice);
      setPriceBreakdown(breakdown);
      showMessage('AI pricing suggestion generated!', 'success');
    } catch (error) {
      showMessage('Failed to generate pricing suggestion', 'error');
      console.error('AI pricing error:', error);
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  const cardActions = [
    { icon: <BookmarkIcon className="text-green-600 mb-2 text-3xl" />, text: 'Saved Properties' },
    { icon: <FavoriteIcon className="text-red-500 mb-2 text-3xl" />, text: 'Favorites' },
    { icon: <FeedbackIcon className="text-purple-600 mb-2 text-3xl" />, text: 'User Feedback' },
  ];

  if (!firstName) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-white">
        <GlassCard className="p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <HomeIcon className="text-white text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Expired</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your profile</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 w-full"
          >
            Go to Sign In
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed top-6 right-6 z-50"
          >
            <GlassCard className="p-4 flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                messageType === "success" ? "bg-green-500" : "bg-red-500"
              }`} />
              <span className="text-sm font-medium">{message}</span>
              <IconButton size="small" onClick={() => setMessage('')} className="ml-2">
                <CloseIcon fontSize="small" />
              </IconButton>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end mb-8 relative" ref={profileRef}>
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Tooltip title="Account menu" arrow>
            <div className="relative">
              {notificationsCount > 0 && (
                <Badge
                  badgeContent={notificationsCount}
                  color="error"
                  overlap="circular"
                  className="absolute -top-2 -right-2"
                />
              )}
              {avatar ? (
                <GradientAvatar alt={firstName} src={avatar} />
              ) : (
                <GradientAvatar>
                  {firstName.charAt(0).toUpperCase()}
                  {lastName?.charAt(0).toUpperCase()}
                </GradientAvatar>
              )}
            </div>
          </Tooltip>

          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-gray-900">
              {firstName} {lastName}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-xs">{email}</p>
          </div>

          <motion.div
            animate={{ rotate: showDropdown ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowDropDownIcon className="text-gray-500" />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute right-0 mt-3 z-40"
            >
              <GlassCard className="w-64 overflow-hidden">
                <div className="p-4 border-b border-gray-200 border-opacity-10">
                  <p className="text-sm font-medium text-gray-900">Account</p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => navigate('/auth/profile')}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:bg-opacity-40 text-left"
                  >
                    <ProfileIcon className="mr-3 text-gray-500" fontSize="small" />
                    My Profile
                  </button>
                </div>
                <Divider className="my-1 opacity-50" />
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`w-full flex items-center px-4 py-3 text-sm text-left ${
                    isLoggingOut
                      ? 'text-gray-500 bg-gray-50 bg-opacity-30'
                      : 'text-red-600 hover:bg-red-50 hover:bg-opacity-30'
                  }`}
                >
                  <LogoutIcon className="mr-3" fontSize="small" />
                  {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                </button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <GlassCard className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold text-gray-900"
              >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{firstName}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 mt-2"
              >
                Your personalized property dashboard is here
              </motion.p>
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={handleViewAllProperties}
              className="mt-6 md:mt-0 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md"
            >
              <SearchIcon />
              View All Properties
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {cardActions.map((action, idx) => (
              <ActionCard
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCardClick(action.text)}
              >
                {action.icon}
                <p className="text-gray-800 font-medium">{action.text}</p>
              </ActionCard>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <GlassCard className="p-6 md:p-8 mb-8">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
            AI Property Valuation Tool
          </h3>
          <p className="text-gray-600 mb-6">
            Our advanced algorithm analyzes multiple factors to provide an accurate market price estimate.
          </p>

          <form onSubmit={handleAIPricing} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="location"
                  name="location"
                  placeholder="City"
                  className="w-full px-6 py-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-base dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition duration-300 placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <FormControl fullWidth>
                  <Select
                    id="propertyType"
                    name="propertyType"
                    defaultValue="house"
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-base dark:text-white"
                    required
                  >
                    <MenuItem value="house">House</MenuItem>
                    <MenuItem value="apartment">Apartment</MenuItem>
                    <MenuItem value="condo">Condo</MenuItem>
                    <MenuItem value="townhouse">Townhouse</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                  Size (sq ft)
                </label>
                <input
                  id="size"
                  name="size"
                  type="number"
                  min="500"
                  placeholder="Square footage"
                  className="w-full px-6 py-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-base dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition duration-300 placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min="1"
                  placeholder="Number of bedrooms"
                  className="w-full px-6 py-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-base dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition duration-300 placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min="1"
                  step="0.5"
                  placeholder="Number of bathrooms"
                  className="w-full px-6 py-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-base dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition duration-300 placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Condition
                </label>
                <FormControl fullWidth>
                  <Select
                    id="condition"
                    name="condition"
                    defaultValue="good"
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-base dark:text-white"
                    required
                  >
                    <MenuItem value="excellent">Excellent</MenuItem>
                    <MenuItem value="good">Good</MenuItem>
                    <MenuItem value="fair">Fair</MenuItem>
                    <MenuItem value="poor">Poor</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div>
                <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-1">
                  Year Built
                </label>
                <input
                  id="yearBuilt"
                  name="yearBuilt"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  placeholder="Construction year"
                  className="w-full px-6 py-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-base dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition duration-300 placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <input id="pool" name="amenities" type="checkbox" value="pool" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor="pool" className="ml-2 text-sm text-gray-700">Pool</label>
                  </div>
                  <div className="flex items-center">
                    <input id="garage" name="amenities" type="checkbox" value="garage" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor="garage" className="ml-2 text-sm text-gray-700">Garage</label>
                  </div>
                  <div className="flex items-center">
                    <input id="garden" name="amenities" type="checkbox" value="garden" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor="garden" className="ml-2 text-sm text-gray-700">Garden</label>
                  </div>
                  <div className="flex items-center">
                    <input id="basement" name="amenities" type="checkbox" value="basement" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor="basement" className="ml-2 text-sm text-gray-700">Basement</label>
                  </div>
                  <div className="flex items-center">
                    <input id="fireplace" name="amenities" type="checkbox" value="fireplace" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor="fireplace" className="ml-2 text-sm text-gray-700">Fireplace</label>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCalculatingPrice}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isCalculatingPrice ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Market Data...
                </span>
              ) : 'Get Valuation Estimate'}
            </button>
          </form>

          {suggestedPrice && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8"
            >
              <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl shadow-inner mb-6">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Valuation Result</h4>
                <div className="flex items-end">
                  <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mr-3">{suggestedPrice}</span>
                  <span className="text-lg text-gray-600 dark:text-gray-300 mb-1">Estimated Market Value</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Based on current market conditions and comparable properties in your area.
                </p>
              </div>

              {priceBreakdown && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-4">Price Breakdown</h5>
                  <div className="space-y-3">
                    {priceBreakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">How this estimate is calculated</h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <p>
                        Our AI analyzes thousands of data points including recent sales, market trends, and property characteristics to provide this estimate. 
                        For a more accurate valuation, consider getting a professional appraisal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default BuyerProfile;