// src/services/authApi.js
import axios from 'axios';
import { saveToIndexedDB, deleteFromIndexedDB } from '../utils/IndexedDBUtils';
import { getFromIndexedDB } from '../utils/IndexedDBUtils';

// Function to get a cookie by name
const getCookie = (name) => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(row => row.startsWith(name + '='));
  return cookie ? cookie.split('=')[1] : null;
};

// Create Axios instance with base URL
const api = axios.create({
  baseURL: '/auth', // Set the base URL to '/auth' as per your requirement
  withCredentials: true, // Ensure credentials (cookies) are included with cross-origin requests
});

const getHeaders = async () => {
    //const tabId = localStorage.getItem('TAB-ID');
    const tabId = await getFromIndexedDB('TAB-ID');
    return tabId ? { 'TAB-ID': tabId } : {};
  };


// Function to get TAB-ID from localStorage
// const getTabIdFromLocalStorage = () => {
//   //return localStorage.getItem('TAB-ID');
//   return window.name ? window.name : null;
// };

// Add request interceptor to attach TAB-ID from localStorage to all requests
// api.interceptors.request.use(
//   (config) => {
//     const tabId = getTabIdFromLocalStorage();
//     if (tabId) {
//       // Attach TAB-ID to every request's headers
//       config.headers['TAB-ID'] = tabId;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// API service for login
export const loginUser = async (loginData) => {
  try {
    const response = await api.post('/login', loginData); // Post request to '/auth/login'
    
    console.log('Response from loginUser:', response.data);

    // Retrieve the tabId from the cookie set by the backend
    const tabId = getCookie('TAB-ID');  // Retrieve TAB-ID from the cookie

    console.log("TAB-ID: ", tabId);

    if (tabId) {
      // Store the TAB-ID in localStorage
      await saveToIndexedDB('TAB-ID', tabId);
      
      //localStorage.setItem('TAB-ID', tabId);
      return response.data; 
    } else {
      throw new Error("Login failed: Missing tabId");
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Register API service
export const registerUser = async (registerData) => {
  try {
    const response = await api.post('/register', registerData); // Post request to '/auth/register'
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Edit Profile
export const editUser = async (editProfileData) => {
  try {
    const response = await api.put('/edit-profile', editProfileData); // Post request to '/auth/register'
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Edit Profile Page failed');
  }
};

// Logout API Service
export const logoutUser = async () => {
  try {
    const response = await api.post('/logout', {}, { withCredentials: true });
    //localStorage.removeItem('TAB-ID');
    await deleteFromIndexedDB('TAB-ID');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

// Email verification API service
export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/verify?token=${token}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Verification failed');
  }
};

export const forgotPassword = async (forgotPasswordData) => {
  try {
    const response = await api.post('/forgot-password', forgotPasswordData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Forgot Password Failed');
  }
};

export const resetPassword = async (resetPasswordData) => {
  try {
    const response = await api.post('/reset-password', resetPasswordData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Reset Password Failed');
  }
};


  export const ProfileDetails = async () => {
   try{
    const response = await api.get('/user-details', {
      headers: getHeaders(),
      withCredentials: true,
    });
    console.log("Response" + response.data);
    return response.data;
   }catch (error){
    throw new Error (error.response?.data?.message || 'User details failed')
   }
  };

// Delete Account
  export const deleteUser = async () => {
    try{
      const response = await api.delete('/delete-account', {
        headers: getHeaders(),
        withCredentials: true,
      });
      console.log("Response" + response.data);
      return response.data;
     }catch (error){
      throw new Error (error.response?.data?.message || 'Failed to Delete Account')
     }
    };
  