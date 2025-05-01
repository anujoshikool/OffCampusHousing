import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiUpload, FiTrash2, FiCheckCircle, FiXCircle, FiDollarSign, FiUsers, FiCalendar } from 'react-icons/fi';
import { FaBed, FaBath, FaMapMarkerAlt } from 'react-icons/fa';
import { updateProperty, getPropertyById } from '../services/SellerApi';

const UpdateMyProperty = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [propertyDetails, setPropertyDetails] = useState({
    title: '',
    description: '',
    listingType: '',
    sellerEmail: '',
    userType: 'SELLER',
    priceTotalUnit: '',
    pricePerIndividual: '',
    avgUtilitiesPerPerson: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    availableFrom: '',
    endOfLease: '',
    dietaryPreference: '',
    status: '',
    peoplePresent: '',
    peopleRequired: '',
    nearestUniversity: '',
    accommodationType: '',
    preferredGender: ''
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [coverPhotoToUpload, setCoverPhotoToUpload] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const property = location.state?.property || await getPropertyById(propertyId);
        
        setPropertyDetails({
          title: property.title || '',
          description: property.description || '',
          listingType: property.listingType || '',
          sellerEmail: property.sellerEmail || '',
          userType: property.userType || 'SELLER',
          priceTotalUnit: property.priceTotalUnit || '',
          pricePerIndividual: property.pricePerIndividual || '',
          avgUtilitiesPerPerson: property.avgUtilitiesPerPerson || '',
          bedrooms: property.bedrooms || '',
          bathrooms: property.bathrooms || '',
          address: property.address || '',
          city: property.city || '',
          state: property.state || '',
          country: property.country || '',
          pincode: property.pincode || '',
          availableFrom: property.availableFrom?.split('T')[0] || '',
          endOfLease: property.endOfLease?.split('T')[0] || '',
          dietaryPreference: property.dietaryPreference || '',
          status: property.status || '',
          peoplePresent: property.peoplePresent || '',
          peopleRequired: property.peopleRequired || '',
          nearestUniversity: property.nearestUniversity || '',
          accommodationType: property.accommodationType || '',
          preferredGender: property.preferredGender || ''
        });

        setImageUrls(property.imageUrls || []);
      } catch (error) {
        console.error('Error fetching property:', error);
        setErrors({ submit: error.message || 'Failed to load property' });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyDetails(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFilesToUpload(prev => [...prev, ...files]);
  };

  const handleCoverPhotoUpload = (e) => {
    setCoverPhotoToUpload(e.target.files[0]);
  };

  const removeFile = (index) => {
    setFilesToUpload(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removeImage = (index) => {
    const imageToDelete = imageUrls[index];
    setImagesToDelete(prev => [...prev, imageToDelete]);
    setImageUrls(prev => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const commonFields = [
      'title', 'description', 'listingType', 'sellerEmail',
      'priceTotalUnit', 'bedrooms', 'bathrooms', 'address',
      'city', 'state', 'country', 'pincode', 'availableFrom',
      'endOfLease', 'dietaryPreference', 'status'
    ];

    commonFields.forEach(field => {
      if (!propertyDetails[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (propertyDetails.listingType === 'ROOM') {
      const roomFields = [
        'pricePerIndividual', 'avgUtilitiesPerPerson', 'peoplePresent',
        'peopleRequired', 'nearestUniversity', 'accommodationType',
        'preferredGender'
      ];
      
      roomFields.forEach(field => {
        if (!propertyDetails[field]) {
          newErrors[field] = 'This field is required for room listings';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccess(false);

    try {
      await updateProperty(
        propertyId,
        propertyDetails,
        imagesToDelete,
        filesToUpload,
        coverPhotoToUpload
      );
      
      setSuccess(true);
      setTimeout(() => navigate(`/myProperties/${propertyId}`), 1500);
    } catch (error) {
      console.error('Update error:', error);
      setErrors({ submit: error.message || 'Failed to update property' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRoom = propertyDetails.listingType === 'ROOM';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Update Property</h1>
          <p className="text-gray-600 mt-2">Edit your property details below</p>
        </div>

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
            <FiXCircle className="mr-2" />
            <span>{errors.submit}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 flex items-center">
            <FiCheckCircle className="mr-2" />
            <span>Property updated successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={propertyDetails.title}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type*</label>
                <select
                  name="listingType"
                  value={propertyDetails.listingType}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.listingType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Type</option>
                  <option value="ROOM">Room</option>
                  <option value="WHOLE_UNIT">Whole Unit</option>
                </select>
                {errors.listingType && <p className="text-red-500 text-xs mt-1">{errors.listingType}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea
                name="description"
                value={propertyDetails.description}
                onChange={handleChange}
                rows={4}
                className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                <select
                  name="status"
                  value={propertyDetails.status}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Status</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="PENDING">Pending</option>
                  <option value="RENTED">Rented</option>
                </select>
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Preference*</label>
                <select
                  name="dietaryPreference"
                  value={propertyDetails.dietaryPreference}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.dietaryPreference ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Preference</option>
                  <option value="VEG">Vegetarian</option>
                  <option value="NON-VEG">Non-Vegetarian</option>
                  <option value="ANY">Any</option>
                </select>
                {errors.dietaryPreference && <p className="text-red-500 text-xs mt-1">{errors.dietaryPreference}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seller Email*</label>
              <input
                type="email"
                name="sellerEmail"
                value={propertyDetails.sellerEmail}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.sellerEmail ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.sellerEmail && <p className="text-red-500 text-xs mt-1">{errors.sellerEmail}</p>}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Price (Unit)*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="priceTotalUnit"
                    value={propertyDetails.priceTotalUnit}
                    onChange={handleChange}
                    className={`w-full pl-8 p-2 border rounded-md ${errors.priceTotalUnit ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.priceTotalUnit && <p className="text-red-500 text-xs mt-1">{errors.priceTotalUnit}</p>}
              </div>

              {isRoom && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Individual*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="pricePerIndividual"
                      value={propertyDetails.pricePerIndividual}
                      onChange={handleChange}
                      className={`w-full pl-8 p-2 border rounded-md ${errors.pricePerIndividual ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                  {errors.pricePerIndividual && <p className="text-red-500 text-xs mt-1">{errors.pricePerIndividual}</p>}
                </div>
              )}
            </div>

            {isRoom && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avg. Utilities Per Person*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="avgUtilitiesPerPerson"
                    value={propertyDetails.avgUtilitiesPerPerson}
                    onChange={handleChange}
                    className={`w-full pl-8 p-2 border rounded-md ${errors.avgUtilitiesPerPerson ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.avgUtilitiesPerPerson && <p className="text-red-500 text-xs mt-1">{errors.avgUtilitiesPerPerson}</p>}
              </div>
            )}
          </div>

          {/* Property Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Property Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBed className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="bedrooms"
                    value={propertyDetails.bedrooms}
                    onChange={handleChange}
                    className={`w-full pl-8 p-2 border rounded-md ${errors.bedrooms ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.bedrooms && <p className="text-red-500 text-xs mt-1">{errors.bedrooms}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBath className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="bathrooms"
                    value={propertyDetails.bathrooms}
                    onChange={handleChange}
                    className={`w-full pl-8 p-2 border rounded-md ${errors.bathrooms ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.bathrooms && <p className="text-red-500 text-xs mt-1">{errors.bathrooms}</p>}
              </div>
            </div>

            {/* Room-specific fields */}
            {isRoom && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation Type*</label>
                    <select
                      name="accommodationType"
                      value={propertyDetails.accommodationType}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md ${errors.accommodationType ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Type</option>
                      <option value="PRIVATE">Private</option>
                      <option value="TEMPORARY">Temporary</option>
                      <option value="SHARED">Shared</option>
                    </select>
                    {errors.accommodationType && <p className="text-red-500 text-xs mt-1">{errors.accommodationType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Gender*</label>
                    <select
                      name="preferredGender"
                      value={propertyDetails.preferredGender}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md ${errors.preferredGender ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="ANY">Any</option>
                    </select>
                    {errors.preferredGender && <p className="text-red-500 text-xs mt-1">{errors.preferredGender}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Residents*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUsers className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="peoplePresent"
                        value={propertyDetails.peoplePresent}
                        onChange={handleChange}
                        className={`w-full pl-8 p-2 border rounded-md ${errors.peoplePresent ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                    {errors.peoplePresent && <p className="text-red-500 text-xs mt-1">{errors.peoplePresent}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spaces Available*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUsers className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="peopleRequired"
                        value={propertyDetails.peopleRequired}
                        onChange={handleChange}
                        className={`w-full pl-8 p-2 border rounded-md ${errors.peopleRequired ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                    {errors.peopleRequired && <p className="text-red-500 text-xs mt-1">{errors.peopleRequired}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nearest University*</label>
                  <input
                    type="text"
                    name="nearestUniversity"
                    value={propertyDetails.nearestUniversity}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.nearestUniversity ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.nearestUniversity && <p className="text-red-500 text-xs mt-1">{errors.nearestUniversity}</p>}
                </div>
              </>
            )}
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Location</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="address"
                  value={propertyDetails.address}
                  onChange={handleChange}
                  className={`w-full pl-8 p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                <input
                  type="text"
                  name="city"
                  value={propertyDetails.city}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                <input
                  type="text"
                  name="state"
                  value={propertyDetails.state}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code*</label>
                <input
                  type="text"
                  name="pincode"
                  value={propertyDetails.pincode}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
              <input
                type="text"
                name="country"
                value={propertyDetails.country}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>
          </div>

          {/* Availability Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Availability</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available From*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="availableFrom"
                    value={propertyDetails.availableFrom}
                    onChange={handleChange}
                    className={`w-full pl-8 p-2 border rounded-md ${errors.availableFrom ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.availableFrom && <p className="text-red-500 text-xs mt-1">{errors.availableFrom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End of Lease*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="endOfLease"
                    value={propertyDetails.endOfLease}
                    onChange={handleChange}
                    className={`w-full pl-8 p-2 border rounded-md ${errors.endOfLease ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.endOfLease && <p className="text-red-500 text-xs mt-1">{errors.endOfLease}</p>}
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Media</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Cover Photo</label>
                <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-md border border-gray-300 flex items-center justify-center">
                  <FiUpload className="mr-2 text-blue-500" />
                  <span className="text-sm">Select Cover Photo</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleCoverPhotoUpload}
                    accept="image/*"
                  />
                </label>
                {coverPhotoToUpload && (
                  <p className="text-xs text-gray-600 mt-1">{coverPhotoToUpload.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Additional Photos</label>
                <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-md border border-gray-300 flex items-center justify-center">
                  <FiUpload className="mr-2 text-blue-500" />
                  <span className="text-sm">Add Photos</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                  />
                </label>
              </div>
            </div>

            {/* Newly Uploaded Files */}
            {filesToUpload.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">New Photos to Upload</h3>
                <div className="space-y-2">
                  {filesToUpload.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Images */}
            {imageUrls.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Photos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {imageUrls.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Property ${index}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMyProperty;