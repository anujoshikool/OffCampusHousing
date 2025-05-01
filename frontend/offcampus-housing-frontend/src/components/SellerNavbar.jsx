import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from '../services/Authapi';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search as SearchIcon, 
  Logout as LogoutIcon, 
  Person as PersonIcon, 
  Notifications as NotificationsIcon, 
  Settings as SettingsIcon, 
  ArrowDropDown as ArrowDropDownIcon,
  Close as CloseIcon,
  Business as PropertiesIcon,
  Favorite as FavoritesIcon,
  Help as HelpIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { Badge, Tooltip, Avatar, Divider, IconButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { FilePlus } from "lucide-react";


// Custom styled components for premium look
const PremiumAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  boxShadow: theme.shadows[2],
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)'
  }
}));

// Mock search API with enhanced results
const mockSearchProperties = async (query) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        query,
        results: [
          { 
            id: 1, 
            title: `${query} Luxury Villa`, 
            address: "123 Ocean View Drive, Malibu", 
            price: "$4,500,000", 
            beds: 5, 
            baths: 4.5,
            sqft: 4500,
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
            featured: true
          },
          { 
            id: 2, 
            title: `${query} Modern Condo`, 
            address: "456 Downtown Blvd, New York", 
            price: "$1,200,000", 
            beds: 2, 
            baths: 2,
            sqft: 1200,
            image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
          }
        ],
        suggestions: query.length > 3 ? [
          `Homes under $1M with ${query}`,
          `${query} with pool`,
          `New constructions in ${query}`
        ] : []
      });
    }, 200);
  });
};

const SellerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { firstName, lastName, userType, email, avatar } = location.state || {};
   console.log("F" + firstName)
  // State management
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState({ results: [], suggestions: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: "New Match Found", 
      text: "A property matching your criteria was just listed", 
      read: false, 
      time: "10 min ago",
      type: "match"
    }
  ]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Refs
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);

  // Fixed click outside handler
  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearchResults(false);
    }
    if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2) {
        handleSearch(searchQuery);
      } else {
        setSearchData({ results: [], suggestions: [] });
        setShowSearchResults(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async (query) => {
    try {
      const data = await mockSearchProperties(query);
      setSearchData(data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchData({ results: [], suggestions: [] });
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      showMessage(response.message || "Successfully logged out", "success");
      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      showMessage(error.message || "Logout failed! Please try again.", "error");
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const clearAllNotifications = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    showMessage("All notifications marked as read", "success");
  };
  console.log("F" + firstName)

  if (typeof firstName !== "string" || firstName.trim() === "") {
    return <div className="text-center py-20 text-gray-1600"></div>;
  }

  // Navigation tabs
  const navTabs = [
    { id: "myProperties", label: "My Properties", icon: <PropertiesIcon fontSize="small" /> },
    { id: "add-property", label: "Add Property", icon: <FilePlus fontSize="small" /> }
  ];

  return (
    <nav className="sticky top-0 z-50 px-6 py-2 flex items-center justify-between bg-white text-gray-800 shadow-sm border-b border-gray-100">
      
      {/* Left: Logo and Navigation */}
      <div className="flex items-center space-x-8">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center cursor-pointer"
        >
          {/* <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-2 bg-gradient-to-r from-indigo-500 to-purple-600">
            <HomeIcon className="w-6 h-6 text-white" />
          </div> */}
          <div className="flex items-center space-x-4">
              <img 
                src="/logo_outline1.png" 
                alt="Campus Nest"
                className="w-14 h-14 object-contain opacity-95 hover:opacity-100 transition-opacity duration-200"
              />
              <div className="flex flex-col border-l border-gray-200 dark:border-gray-600 pl-4">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
                  Campus <span className="text-indigo-500">Nest</span>
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-light">
                  Your home away from home
                </p>
              </div>
            </div>
          {/* <span className="text-xl font-bold text-gray-800">
            Campus<span className="text-indigo-500">Nest</span>
          </span> */}
        </motion.div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1">
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                navigate(`/${tab.id}`);
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg flex items-center space-x-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-100 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={`${activeTab === tab.id ? 'text-indigo-400' : ''}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Center: Search */}
      <div className="relative mx-4 flex-1 max-w-2xl" ref={searchRef}>
        <motion.div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 rounded-xl transition-all text-sm bg-gray-50 border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder-gray-500 border shadow-sm"
            placeholder="Search properties, locations, agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              setIsSearchFocused(true);
              if (searchQuery.length > 2) setShowSearchResults(true);
            }}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowSearchResults(false);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <CloseIcon className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </motion.div>
        
        {/* Search Results */}
        <AnimatePresence>
          {showSearchResults && (searchData.results.length > 0 || searchData.suggestions.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-2 w-full rounded-xl shadow-xl overflow-hidden bg-white border border-gray-200"
            >
              <div className="max-h-[28rem] overflow-y-auto">
                {searchData.suggestions.length > 0 && (
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">
                      Quick Suggestions
                    </h3>
                    <div className="space-y-2">
                      {searchData.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setSearchQuery(suggestion);
                            handleSearch(suggestion);
                          }}
                        >
                          <div className="flex items-center">
                            <SearchIcon className="h-4 w-4 mr-2 opacity-60" />
                            {suggestion}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchData.results.length > 0 && (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                      <h3 className="text-xs font-semibold uppercase tracking-wider">
                        Property Matches ({searchData.results.length})
                      </h3>
                      <button 
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                        onClick={() => navigate(`/search?q=${encodeURIComponent(searchQuery)}`)}
                      >
                        View all
                      </button>
                    </div>
                    {searchData.results.map((result) => (
                      <div
                        key={result.id}
                        className="px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                        onClick={() => {
                          navigate(`/property/${result.id}`);
                          setShowSearchResults(false);
                        }}
                      >
                        <div className="flex">
                          {result.image && (
                            <div className="w-16 h-16 rounded-md overflow-hidden mr-3 flex-shrink-0">
                              <img 
                                src={result.image} 
                                alt={result.title} 
                                className="w-full h-full object-cover"
                              />
                              {result.featured && (
                                <div className="absolute top-2 left-2 bg-indigo-500 text-white text-xs px-1.5 py-0.5 rounded">
                                  Featured
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{result.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 truncate">{result.address}</p>
                            <div className="flex items-center mt-2 text-xs space-x-3">
                              <span className="font-semibold text-indigo-600">{result.price}</span>
                              <span>{result.beds} beds</span>
                              <span>{result.baths} baths</span>
                              <span>{result.sqft} sqft</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

   {/* Right: User Controls */}
<div className="flex items-center space-x-4">
  {/* Feedback Icon */}
  <Tooltip title="User Feedback" arrow>
    <IconButton
      onClick={() => navigate('/UserFeedback')}
      className="text-gray-600 hover:bg-gray-100"
    >
      <FeedbackIcon /> {/* Updated icon */}
    </IconButton>
  </Tooltip>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <Tooltip title="Notifications" arrow>
            <IconButton
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-gray-600 hover:bg-gray-100"
            >
              <Badge 
                color="error" 
                variant="dot" 
                invisible={notifications.every(n => n.read)}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-96 rounded-xl shadow-xl z-50 overflow-hidden bg-white border border-gray-200"
              >
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={clearAllNotifications}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
                <div className="max-h-[28rem] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full ml-2 mt-1 bg-indigo-500"></span>
                          )}
                        </div>
                        <p className="text-sm mt-1">{notification.text}</p>
                        <div className="text-xs mt-2 text-gray-500">
                          {notification.time}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <p className="text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 focus:outline-none rounded-full transition-colors hover:bg-gray-100 pl-1 pr-2"
            aria-label="User profile"
          >
            <PremiumAvatar>
              {firstName.charAt(0).toUpperCase()}
              {lastName && lastName.charAt(0).toUpperCase()}
            </PremiumAvatar>
            <motion.div
              animate={{ rotate: showDropdown ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowDropDownIcon className="text-gray-500" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl z-50 overflow-hidden bg-white border border-gray-200"
              >
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <PremiumAvatar sx={{ width: 48, height: 48 }}>
                      {firstName.charAt(0).toUpperCase()}
                      {lastName && lastName.charAt(0).toUpperCase()}
                    </PremiumAvatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        {firstName} {lastName}
                      </p>
                      <p className="text-xs mt-1 text-gray-500 truncate" title={email}>
                        {email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="py-1">
                  <motion.a
                    whileHover={{ x: 3 }}
                    href="#"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/auth/profile');
                      setShowDropdown(false);
                    }}
                  >
                    <PersonIcon className="mr-3 text-sm" /> My Profile
                  </motion.a>
                  <motion.a
                    whileHover={{ x: 3 }}
                    href="#"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/settings');
                      setShowDropdown(false);
                    }}
                  >
                    
                  </motion.a>
                </div>

                <Divider className="bg-gray-200" />

                {/* Footer Actions */}
                <div className="py-1">
                  <motion.a
                    whileHover={{ x: 3 }}
                    href="#"
                    className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                      setShowDropdown(false);
                    }}
                  >
                    <LogoutIcon className="mr-3 text-sm" /> Sign Out
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-xl z-50 flex items-center ${
              messageType === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {messageType === "success" ? (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium text-sm">{message}</span>
            </div>
            <button 
              onClick={() => setMessage("")}
              className="ml-4 opacity-70 hover:opacity-100"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default SellerNavbar;