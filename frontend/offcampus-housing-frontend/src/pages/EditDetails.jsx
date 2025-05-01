import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileDetails, editUser, deleteUser } from '../services/Authapi'; // make sure deleteUser is added in your Authapi

const EditDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ProfileDetails();
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          dob: data.dob || '',
        });
      } catch (err) {
        console.error('Error loading profile data for editing:', err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
      });
      console.log('Profile updated successfully');
      navigate('/auth/profile');
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (confirmDelete) {
      try {
        await deleteUser(); // Assuming deleteUser handles account deletion
        console.log('Account deleted successfully');
        navigate('/auth/login'); // Redirect to login or homepage
      } catch (error) {
        console.error('Error deleting account:', error.message);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 tracking-tight text-center">Edit Your Profile</h2>

        {/* Display Email at the top */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-500 mb-2">Email Address</label>
          <div className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
            {formData.email}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>

          <div className="flex justify-between items-center pt-8 space-x-4">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/auth/profile')}
                className="px-5 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
              >
                Save Changes
              </button>
            </div>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="px-5 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDetails;
