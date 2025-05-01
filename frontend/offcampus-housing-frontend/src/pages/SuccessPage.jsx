// src/pages/SuccessPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Subscription completed successfully!");
    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Payment Successful!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Thank you for subscribing. Your premium features are now active.
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Redirecting to your Login Page...
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;