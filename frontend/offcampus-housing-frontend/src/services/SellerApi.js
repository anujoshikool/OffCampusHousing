// src/services/sellerApi.js
import axios from 'axios';
import { getFromIndexedDB } from '../utils/IndexedDBUtils';
// Function to get a cookie by name
// const getCookie = (name) => {
//   const cookies = document.cookie.split('; ');
//   const cookie = cookies.find(row => row.startsWith(name + '='));
//   return cookie ? cookie.split('=')[1] : null;
// };

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: '/api/seller-properties',
  withCredentials: true,
});

// Function to get headers with TAB-ID
const getHeaders = async () => {
  //const tabId = localStorage.getItem('TAB-ID');
  const tabId = await getFromIndexedDB('TAB-ID');
  return tabId ? { 'TAB-ID': tabId } : {};
};

// Add Property API
export const addProperty = async (propertyData, files, coverPhoto) => {
  try {
    const formData = new FormData();

    // Append form fields (propertyData) that match the backend DTO
    Object.entries(propertyData).forEach(([key, value]) => {
      formData.append(key, value); // No prefixes or dot notation
    });

    // Append the coverPhoto file with the correct parameter name
    formData.append('coverPhoto', coverPhoto);

    // Ensure files is an array before attempting to use forEach
    if (Array.isArray(files)) {
      files.forEach(file => formData.append('files', file));
    } else {
      console.error("Files is not an array:", files);
    }

    // Debugging: log the FormData contents for verification
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? value.name : value);
    }

    // Make the POST request with the form data
    const response = await api.post('/addProperty', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the correct content type
        ...getHeaders(),
      },
      withCredentials: true,  // If you're using sessions or cookies
    });

    return response.data; // Return the response from the backend
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Get Property by ID
export const getPropertyById = async (propertyId) => {
  try {
    const response = await api.get(`/myProperties/${propertyId}`, {
      headers: getHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get property');
  }
};


export const getPropertyById1 = async (propertyId) => {
    try {
      const response = await api.get(`/${propertyId}`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get property');
    }
  };



// Update Property API
export const updateProperty = async (propertyId, propertyDetailsJson, imagesToDeleteListJson, imagesToUpload) => {
  try {
    const formData = new FormData();
    formData.append('propertyDetails', JSON.stringify(propertyDetailsJson));
    if (imagesToDeleteListJson?.length > 0) {
      formData.append('imagesToDeleteList', JSON.stringify(imagesToDeleteListJson));
    }
    imagesToUpload.forEach(image => formData.append('imagesToUpload', image));

    const response = await api.put(`/${propertyId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data', ...getHeaders() },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update property');
  }
};



// Get Properties by Seller API
export const getPropertiesBySeller = async () => {
  try {
    const response = await api.get('/myProperties', {
      headers: getHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const err = new Error(error.response?.data?.message || 'Error fetching property details. Please try again later.');
    err.status = error.response?.status || null;
    throw err;
  }
};

// Delete Property API
export const deleteProperty = async (propertyId) => {
  try {
    const response = await api.delete('/deleteProperty', {
      headers: getHeaders(),
      data: [propertyId],
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete property');
  }
};

export const postFeedback = async (feedbackDetails) => {
  try{
    const response = await api.post('/feedback', feedbackDetails,
      {
      headers: getHeaders(),
      withCredentials: true,
    });
    return response.data;


  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to post feedback ');
  }
};



// Get Recent Activities API
export const getRecentActivities = async () => {
  try {
    const response = await api.get('/recentActivity', {
      headers: await getHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch recent activities');
  }
};