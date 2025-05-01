import React, { useEffect, useState } from 'react';
import { ProfileDetails } from '../services/Authapi';
import { Pencil, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await ProfileDetails();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile details:', err);
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-rose-500 max-w-md w-full text-center">
          <p className="text-rose-600 font-medium text-lg">Error loading profile</p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Profile Details</h2>
          <p className="text-indigo-100 text-sm">Your personal information</p>

          {/* Back Button */}
          <button
            className="absolute top-6 left-6 bg-white text-indigo-600 hover:bg-gray-100 border border-gray-200 rounded-full p-2 shadow transition-all"
            title="Back"
            onClick={() => navigate(-1)} // This will take the user to the previous page
          >
            <ArrowLeft size={20} />
          </button>

          {/* Edit Button */}
          <button
            className="absolute top-6 right-6 bg-white text-indigo-600 hover:bg-gray-100 border border-gray-200 rounded-full p-2 shadow transition-all"
            title="Edit Profile"
            onClick={() => navigate('/auth/edit-profile')}
          >
            <Pencil size={20} />
          </button>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          <Detail label="Name" value={`${profileData.firstName} ${profileData.lastName}`} />
          <Detail label="Email" value={profileData.email} />
          <Detail label="Date of Birth" value={profileData.dob} />
          <Detail label="Role" value={profileData.role} />
          <Detail label="Gender" value={profileData.gender} />
          
          {/* Add more fields if needed */}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-right">
          <span className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

// Subcomponent for clean field rendering
const Detail = ({ label, value }) => (
  <div className="border-b border-gray-100 pb-4">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</p>
    <p className="text-lg text-gray-800 font-medium mt-1">{value}</p>
  </div>
);

export default ProfilePage;
