import React, { useState } from 'react';
import { forgotPassword } from '../services/Authapi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Close as CloseIcon,
  Email as EmailIcon,
  Person as UserTypeIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const response = await forgotPassword({ email, userType });
      setMessage(response.message);
      setIsSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'An error occurred');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
              isSubmitting ? 'text-gray-400' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <CloseIcon fontSize="small" />
          </button>

          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                <EmailIcon className="text-blue-500" fontSize="medium" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Reset Your Password</h2>
              <p className="text-gray-500 text-sm mt-1">
                Enter your email to receive a password reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EmailIcon className="h-5 w-5 text-gray-400" fontSize="small" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserTypeIcon className="h-5 w-5 text-gray-400" fontSize="small" />
                  </div>
                  <select
                    id="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select account type</option>
                    <option value="BUYER">Buyer</option>
                    <option value="SELLER">Seller</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`mt-4 p-3 rounded-lg border ${
                    isSuccess
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {isSuccess ? (
                        <SuccessIcon className="h-5 w-5 text-green-500" fontSize="small" />
                      ) : (
                        <ErrorIcon className="h-5 w-5 text-red-500" fontSize="small" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{message}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 text-center text-sm text-gray-500">
              Remember your password?{' '}
              <button
                type="button"
                onClick={handleClose}
                className="font-medium text-blue-600 hover:text-blue-500"
                disabled={isSubmitting}
              >
                Sign in
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;