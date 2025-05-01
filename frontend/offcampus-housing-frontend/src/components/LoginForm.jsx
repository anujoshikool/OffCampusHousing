import React, { useState, useContext } from 'react';
import { loginUser } from '../services/Authapi';
import ForgotPasswordModal from './ForgotPasswordModal';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({ email: '', password: '', userType: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      const { redirectUrl, firstName, userType } = response;
      if (redirectUrl) {
        login({ userType });
        navigate(redirectUrl, { state: { firstName, userType } });
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 rounded-2xl shadow-lg animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
        <p className="text-black-500 mt-1">Sign in to access your account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoFocus
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
            required
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <button 
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-12 shadow-sm"
              required
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
              tabIndex={-1}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="userType" className="block text-sm font-medium text-gray-700">Account type</label>
          <select
            id="userType"
            name="userType"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
            required
            onChange={handleChange}
          >
            <option value="">Select account type</option>
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-black-600">
          Don't have an account?{' '}
          <button 
            onClick={() => setActiveTab('register')}
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Register now
          </button>
        </p>
      </div>

      {showForgotPassword && (
        <ForgotPasswordModal 
          isOpen={showForgotPassword} 
          onClose={() => setShowForgotPassword(false)} 
        />
      )}
    </div>
  );
};

export default LoginForm;
