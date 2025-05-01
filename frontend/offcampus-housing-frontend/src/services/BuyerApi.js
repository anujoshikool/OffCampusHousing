import axios from 'axios';
import { getFromIndexedDB } from '../utils/IndexedDBUtils';

const api = axios.create({
    baseURL: '/api/buyer-properties',
    withCredentials: true,
  });

  
  // Function to get headers with TAB-ID
const getHeaders = async () => {
    //const tabId = localStorage.getItem('TAB-ID');
    const tabId = await getFromIndexedDB('TAB-ID');
    return tabId ? { 'TAB-ID': tabId } : {};
  };


  export const getAllBuyerProperties = async () => {
    try {
      const response = await api.get('/allProperties', {
        headers: getHeaders(),
        withCredentials: true,
      });
      if (response.data && Array.isArray(response.data)) {
        return response.data; // Return the list of properties (BuyerPropertyWithMediaDto)
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get properties');
    }
  };

  export const getPropertyDetails = async (propertyId) => {
    try {
        const response = await api.get(`/buyerProperty/${propertyId}`, {
            headers: await getHeaders(),
            withCredentials: true,
        });
        if (response.data) {
            return response.data; // Return the property details (BuyerPropertyWithMediaDto)
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to get property details');
    }
};

export const sendEmailToSeller = async (propertyId, appointmentRequest) => {
  try {
      console.log('Sending to backend:', appointmentRequest); 

      const response = await api.post(
        `/express-Interest/${propertyId}`, 
        appointmentRequest,               
        {
            headers: await getHeaders(),  
            withCredentials: true,      
        }
    );

      return response.data;  
  } catch (error) {

      console.error('Error in sendEmailToSeller:', error);

      throw new Error(error.response?.data?.message || 'Failed to send the request to the seller');
  }
};


export const count = async() => {
  try{
    const response = await api.get('/totalListing');
    console.log("response" +response.data);
    return response.data;

  }catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to get property details');
    }

};





// Favorite Properties Endpoints
export const toggleFavorite = async (propertyId) => {
  try {
    const response = await api.post(
      `/buyerProperty/${propertyId}/favorite`,
      { headers: await getHeaders()
       }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to toggle favorite');
  }
};

export const toggleSavedProperty = async (propertyId) => {
  try {
    const response = await api.post(
      `/buyerProperty/${propertyId}/save`,
      { headers: await getHeaders()
       }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to toggle saved property');
  }
};

export const getFavorites = async () => {
  try {
    const response = await api.get('/favorites', {
      headers: await getHeaders()
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get favorites');
  }
};

export const getSavedProperties = async () => {
  try {
    const response = await api.get('/saved', {
      headers: await getHeaders()
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get saved properties');
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