import React, { createContext, useState, useEffect } from 'react';
import { saveToIndexedDB, getFromIndexedDB, deleteFromIndexedDB } from '../utils/IndexedDBUtils';


// Function to get a cookie by name
const getCookie = (name) => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(row => row.startsWith(name + '='));
  return cookie ? cookie.split('=')[1] : null;
};

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const tabId = localStorage.getItem('TAB-ID');
//     const userType = localStorage.getItem('USER-TYPE'); // Retrieve userType
//     if (tabId && userType) {
//       setUser({ tabId,userType });
     
//     }

//     setLoading(false);
//   }, []);

useEffect(() => {
    const initializeAuth = async () => {
      const tabId = await getFromIndexedDB('TAB-ID');
      const userType = await getFromIndexedDB('USER-TYPE');
      
      if (tabId && userType) {
        setUser({ tabId, userType });
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);


  const login = async ({ userType }) => {
    const tabId = getCookie('TAB-ID'); // Retrieve the tabId from the cookie

    if (tabId) {
      setUser({ tabId,userType });
      await saveToIndexedDB('TAB-ID', tabId);
      await saveToIndexedDB('USER-TYPE', userType);
    //   localStorage.setItem('TAB-ID', tabId);
    //   localStorage.setItem('USER-TYPE', userType); // Optionally store userType
    } else {
      console.error('No tabId found in cookie after login.');
    }
  };

  const logout = async () => {
    setUser(null);
    await deleteFromIndexedDB('TAB-ID');
    await deleteFromIndexedDB('USER-TYPE');
    // localStorage.removeItem('TAB-ID');
    // localStorage.removeItem('USER-TYPE');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
