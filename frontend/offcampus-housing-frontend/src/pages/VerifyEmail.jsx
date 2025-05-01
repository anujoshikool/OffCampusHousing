import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/Authapi';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();  // To get query params from the URL
  const token = searchParams.get('token');  // Extract the token from the URL
  const navigate = useNavigate();
  // useRef to track if the effect has run
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true; // Set it to true so it doesn't run again

      if (token) {
        verifyEmail(token)
          .then((response) => {
            if (response && response.message) {
              setMessage(response.message);  // Set the message from the API response
            } else {
              setMessage('No message returned from API.');
            }
            setLoading(false);
          })
          .catch((error) => {
            setMessage(error.message || 'Something went wrong.');
            setLoading(false);
          });
      } else {
        setMessage('No token provided.');
        setLoading(false);
      }
    }
  }, [token]); // Re-run only if token changes

   // Redirect after 3 seconds
   useEffect(() => {
    if (!loading && message) {
      const timer = setTimeout(() => {
        navigate('/', { state: { showLogin: true } });  // Pass state to trigger login
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, message, navigate]);

  if (loading) {
    return <div>Loading...</div>;  // Display a loading message while verification is happening
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className={`bg-green-500 p-6 shadow-md rounded-lg w-full max-w-md text-center transition-all transform ${
          loading ? 'translate-y-16 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <h1 className="text-xl font-semibold text-white">Email Verification</h1>
        <p className="mt-4 text-white">{message || 'No message available.'}</p>
        <p className="mt-2 text-white text-sm">Redirecting to login page in 3 seconds...</p>
      </div>
    </div>
  );
  
};

export default VerifyEmail;
