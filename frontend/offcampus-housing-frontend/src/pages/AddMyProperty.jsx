import React, { useState, useEffect } from 'react';
import { FiUpload, FiTrash2, FiCheckCircle, FiDollarSign, FiUsers, FiCalendar, FiHome } from 'react-icons/fi';
import { FaBed, FaBath, FaMapMarkerAlt } from 'react-icons/fa';
import { addProperty, updateProperty } from '../services/SellerApi';

const PropertyForm = ({ propertyId, initialData }) => {
  const [formData, setFormData] = useState({
    listingType: '',
    sellerEmail: '',
    userType: 'SELLER',
    title: '',
    description: '',
    priceTotalUnit: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    availableFrom: '',
    endOfLease: '',
    dietaryPreference: '',
    status: '',
    pricePerIndividual: 0.0,
    avgUtilitiesPerPerson: 0.0,
    peoplePresent: 0,
    peopleRequired: '',
    nearestUniversity: '',
    accommodationType: '',
    preferredGender: '',
    coverPhoto: null,
    files: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const handleCoverPhotoUpload = (e) => {
    setFormData(prev => ({
      ...prev,
      coverPhoto: e.target.files[0]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => {
      const newFiles = [...prev.files];
      newFiles.splice(index, 1);
      return {
        ...prev,
        files: newFiles
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    const commonFields = [
      'listingType', 'sellerEmail', 'title', 'description', 
      'priceTotalUnit', 'bedrooms', 'bathrooms', 'address',
      'city', 'state', 'pincode', 'country', 'availableFrom', 'endOfLease',
      'dietaryPreference', 'status', 'peopleRequired'
    ];
    
    commonFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.listingType === 'ROOM') {
      const roomFields = [
        'pricePerIndividual', 'avgUtilitiesPerPerson', 'peoplePresent',
        'nearestUniversity', 'accommodationType', 'preferredGender'
      ];
      
      roomFields.forEach(field => {
        if (!formData[field]) {
          newErrors[field] = 'This field is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (!validateForm()) {
      return;
    }


    const submissionData = {
      ...formData
      // Final safeguard
    };



    setIsSubmitting(true);
    try {
      let response;
      if (propertyId) {
        response = await updateProperty(
          propertyId,
          submissionData,
          submissionData.coverPhoto,
          submissionData.files
        );
      } else {
        console.log("Submitting new property:", submissionData);
        response = await addProperty(
          submissionData,
          submissionData.files,
          submissionData.coverPhoto
        );
      }
      // Display the exact message from backend
      setSuccessMessage(response.message);

  
      // Clear message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
  
      return response;
      
    } catch (error) {
      console.error('Submission error:', error);
      
      // Display the exact error message from backend
      setSuccessMessage(error.response?.data?.message || error.message);
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRoom = formData.listingType === 'ROOM';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#f9f7f3] rounded-2xl shadow-lg border border-[#e8e5dd] transition-all duration-300 hover:shadow-2xl hover:border-[#d4af37]">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        {propertyId ? 'Modify Property' : 'Add New Property'}
      </h1>

      {successMessage && (
        <div className={`mb-4 p-3 ${successMessage.includes('Error') || successMessage.includes('Failed') ? 'bg-red-50 border-red-500 text-red-700' : 'bg-emerald-50 border-emerald-500 text-emerald-700'} border-l-4 rounded flex items-center`}>
          <FiCheckCircle className="mr-2" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Listing Type <span className="text-rose-500">*</span>
              </label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
                className={`w-full p-2 text-sm border rounded focus:ring-1 ${errors.listingType ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                required
              >
                <option value="">Select Type</option>
                <option value="ROOM">Room</option>
                <option value="WHOLE_UNIT">Whole Unit</option>
              </select>
              {errors.listingType && <p className="text-rose-500 text-xs mt-1">{errors.listingType}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full p-2 text-sm border rounded focus:ring-1 ${errors.status ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                required
              >
                <option value="">Select Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="NOT AVAILABLE">Not Available</option>
              </select>
              {errors.status && <p className="text-rose-500 text-xs mt-1">{errors.status}</p>}
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 text-sm border rounded focus:ring-1 ${errors.title ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
              placeholder="Beautiful 2BR Apartment near Campus"
              required
            />
            {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full p-2 text-sm border rounded focus:ring-1 ${errors.description ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
              placeholder="Describe your property in detail..."
              required
            />
            {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Dietary Preference <span className="text-rose-500">*</span>
              </label>
              <select
                name="dietaryPreference"
                value={formData.dietaryPreference}
                onChange={handleChange}
                className={`w-full p-2 text-sm border rounded focus:ring-1 ${errors.dietaryPreference ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                required
              >
                <option value="">Select Preference</option>
                <option value="VEGETARIAN">Vegetarian</option>
                <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                <option value="ANY">Any</option>
              </select>
              {errors.dietaryPreference && <p className="text-rose-500 text-xs mt-1">{errors.dietaryPreference}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Seller Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="sellerEmail"
                value={formData.sellerEmail}
                onChange={handleChange}
                className={`w-full p-2 text-sm border rounded focus:ring-1 ${errors.sellerEmail ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                placeholder="your@email.com"
                required
              />
              {errors.sellerEmail && <p className="text-rose-500 text-xs mt-1">{errors.sellerEmail}</p>}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Pricing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Total Price (Unit) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                  <FiDollarSign className="text-sm" />
                </div>
                <input
                  type="number"
                  name="priceTotalUnit"
                  value={formData.priceTotalUnit}
                  onChange={handleChange}
                  className={`w-full pl-8 p-2 text-sm border rounded focus:ring-1 ${errors.priceTotalUnit ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                  placeholder="0.00"
                  required
                />
              </div>
              {errors.priceTotalUnit && <p className="text-rose-500 text-xs mt-1">{errors.priceTotalUnit}</p>}
            </div>

            {isRoom && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Price Per Individual <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                    <FiDollarSign className="text-sm" />
                  </div>
                  <input
                    type="number"
                    name="pricePerIndividual"
                    value={formData.pricePerIndividual}
                    onChange={handleChange}
                    className={`w-full pl-8 p-2 text-sm border rounded focus:ring-1 ${errors.pricePerIndividual ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                    placeholder="0.00"
                    required={isRoom}
                  />
                </div>
                {errors.pricePerIndividual && <p className="text-rose-500 text-xs mt-1">{errors.pricePerIndividual}</p>}
              </div>
            )}
          </div>

          {isRoom && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Avg. Utilities Per Person <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                    <FiDollarSign className="text-sm" />
                  </div>
                  <input
                    type="number"
                    name="avgUtilitiesPerPerson"
                    value={formData.avgUtilitiesPerPerson}
                    onChange={handleChange}
                    className={`w-full pl-8 p-2 text-sm border rounded focus:ring-1 ${errors.avgUtilitiesPerPerson ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                    placeholder="0.00"
                    required={isRoom}
                  />
                </div>
                {errors.avgUtilitiesPerPerson && <p className="text-rose-500 text-xs mt-1">{errors.avgUtilitiesPerPerson}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Property Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Property Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Bedrooms <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                  <FaBed className="text-sm" />
                </div>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className={`w-full pl-8 p-2 text-sm border rounded focus:ring-1 ${errors.bedrooms ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                  placeholder="2"
                  required
                />
              </div>
              {errors.bedrooms && <p className="text-rose-500 text-xs mt-1">{errors.bedrooms}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Bathrooms <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                  <FaBath className="text-sm" />
                </div>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className={`w-full pl-8 p-2 text-sm border rounded focus:ring-1 ${errors.bathrooms ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                  placeholder="1"
                  required
                />
              </div>
              {errors.bathrooms && <p className="text-rose-500 text-xs mt-1">{errors.bathrooms}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                People Required <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                  <FiUsers className="text-sm" />
                </div>
                <input
                  type="number"
                  name="peopleRequired"
                  value={formData.peopleRequired}
                  onChange={handleChange}
                  className={`w-full pl-8 p-2 text-sm border rounded focus:ring-1 ${errors.peopleRequired ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                  placeholder="1"
                  required
                />
              </div>
              {errors.peopleRequired && <p className="text-rose-500 text-xs mt-1">{errors.peopleRequired}</p>}
            </div>
          </div>

          {/* Room-specific fields */}
          {isRoom && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Accommodation Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="accommodationType"
                    value={formData.accommodationType}
                    onChange={handleChange}
                    className={`w-full p-2 text-sm border rounded focus:ring-1 ${errors.accommodationType ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                    required={isRoom}
                  >
                    <option value="">Select Type</option>
                    <option value="PRIVATE">Private</option>
                    <option value="TEMPORARY">Temporary</option>
                    <option value="SHARED">Shared</option>
                  </select>
                  {errors.accommodationType && <p className="text-rose-500 text-xs mt-1">{errors.accommodationType}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Preferred Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="preferredGender"
                    value={formData.preferredGender}
                    onChange={handleChange}
                    className={`w-full p-2 text-sm border rounded focus:ring-1 ${errors.preferredGender ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                    required={isRoom}
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="ANY">Any</option>
                  </select>
                  {errors.preferredGender && <p className="text-rose-500 text-xs mt-1">{errors.preferredGender}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Current Residents <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                      <FiUsers className="text-sm" />
                    </div>
                    <input
                      type="number"
                      name="peoplePresent"
                      value={formData.peoplePresent}
                      onChange={handleChange}
                      className={`w-full pl-8 p-2 text-sm border rounded focus:ring-1 ${errors.peoplePresent ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                      placeholder="1"
                      required={isRoom}
                    />
                  </div>
                  {errors.peoplePresent && <p className="text-rose-500 text-xs mt-1">{errors.peoplePresent}</p>}
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Nearest University <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="nearestUniversity"
                  value={formData.nearestUniversity}
                  onChange={handleChange}
                  className={`w-full p-2 text-sm border rounded focus:ring-1 ${errors.nearestUniversity ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                  placeholder="University name"
                  required={isRoom}
                />
                {errors.nearestUniversity && <p className="text-rose-500 text-xs mt-1">{errors.nearestUniversity}</p>}
              </div>
            </>
          )}
        </div>

        {/* Location Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Location
          </h2>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Street Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                <FaMapMarkerAlt className="text-sm" />
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full pl-8 p-2 text-sm border rounded focus:ring-1 ${errors.address ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                placeholder="123 Main St"
                required
              />
            </div>
            {errors.address && <p className="text-rose-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full p-2 text-sm border rounded focus:ring-1 ${errors.city ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                placeholder="City"
                required
              />
              {errors.city && <p className="text-rose-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full p-2 text-sm border rounded focus:ring-1 ${errors.state ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                placeholder="State"
                required
              />
              {errors.state && <p className="text-rose-500 text-xs mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Pincode <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className={`w-full p-2 text-sm border rounded focus:ring-1 ${errors.pincode ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                placeholder="Postal/Zip code"
                required
              />
              {errors.pincode && <p className="text-rose-500 text-xs mt-1">{errors.pincode}</p>}
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Country <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full p-2 text-sm border rounded focus:ring-1 ${errors.country ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
              placeholder="Country"
              required
            />
            {errors.country && <p className="text-rose-500 text-xs mt-1">{errors.country}</p>}
          </div>
        </div>

        {/* Availability Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Availability
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Available From <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                  <FiCalendar className="text-sm" />
                </div>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  className={`w-full pl-8 p-2 text-sm border rounded focus:ring-1 ${errors.availableFrom ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                  required
                />
              </div>
              {errors.availableFrom && <p className="text-rose-500 text-xs mt-1">{errors.availableFrom}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                End of Lease <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                  <FiCalendar className="text-sm" />
                </div>
                <input
                  type="date"
                  name="endOfLease"
                  value={formData.endOfLease}
                  onChange={handleChange}
                  className={`w-full pl-8 p-2 text-sm border rounded focus:ring-1 ${errors.endOfLease ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                  required
                />
              </div>
              {errors.endOfLease && <p className="text-rose-500 text-xs mt-1">{errors.endOfLease}</p>}
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Media
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Cover Photo <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center">
                <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded border border-gray-200 flex items-center text-sm">
                  <FiUpload className="mr-2 text-blue-500" />
                  <span className="text-gray-700">Upload Cover Photo</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleCoverPhotoUpload}
                    accept="image/*"
                  />
                </label>
                {formData.coverPhoto && (
                  <span className="ml-2 text-xs text-gray-600">{formData.coverPhoto.name}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Additional Photos/Videos
              </label>
              <div className="flex items-center">
                <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded border border-gray-200 flex items-center text-sm">
                  <FiUpload className="mr-2 text-blue-500" />
                  <span className="text-gray-700">Add Files</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,video/*"
                    multiple
                    required
                  />
                </label>
              </div>
            </div>
          </div>

          {formData.files.length > 0 && (
            <div className="mt-3">
              <h3 className="text-xs font-medium text-gray-600 mb-2">Uploaded Files</h3>
              <div className="space-y-2">
                {formData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                    <span className="text-xs text-gray-700 truncate max-w-xs">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow transition-colors text-sm"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              propertyId ? 'Update Property' : 'Add Property'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;