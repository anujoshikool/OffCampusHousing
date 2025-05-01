import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../services/Authapi';

const RegisterForm = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    dob: '2000-01-01',
    password: '',
    role: 'USER',
    userType: 'BUYER'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageType, setMessageType] = useState('success');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser({ ...formData });
      setMessage(response.message);
      setMessageType('success');
      setMessageVisible(true);

      setTimeout(() => {
        setMessageVisible(false);
        setActiveTab('login');
      }, 3000);
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 3000);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Create your account</h2>
        <p className="text-black-500 text-sm">Join our platform and find your perfect place</p>
      </div>

      {messageVisible && (
        <div className={`mb-5 p-3 rounded-md text-sm border transition-all duration-300 ${
          messageType === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            minLength={8}
            className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <p className="text-xs text-black-400 mt-1">Minimum 8 characters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled hidden>Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
              Date of birth
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="block text-sm font-medium text-gray-700 mb-1">
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
              Account type <span className="text-red-500">*</span>
            </label>
            <select
              id="userType"
              name="userType"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="BUYER">Buyer</option>
              <option value="SELLER">Seller</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Account
        </button>
      </form>

      <div className="mt-5 pt-5 border-t border-gray-200 text-center">
        <p className="text-sm text-black-600">
          Already have an account?{' '}
          <button
            onClick={() => setActiveTab('login')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </button>
        </p>
      </div>
    </>
  );
};

export default RegisterForm;
