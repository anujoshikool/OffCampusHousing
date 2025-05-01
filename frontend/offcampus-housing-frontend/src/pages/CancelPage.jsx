// src/pages/CancelPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const CancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.warning("Subscription process was canceled");
    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      navigate('/api/seller-properties');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <XCircle className="mx-auto h-16 w-16 text-yellow-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Payment Canceled
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Your subscription process was not completed. You can try again anytime.
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
};

export default CancelPage;