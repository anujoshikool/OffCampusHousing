import React, { useEffect, useState } from 'react';
import './App.css';
import AuthTabs from './components/AuthTabs';
import AppRoutes from './routes/Routes';
import { useLocation } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { Sun, Moon } from 'lucide-react';

function App() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  const showAuthTabsOn = ['/', '/auth/login', '/auth/register'];
  const shouldShowAuthTabs = showAuthTabsOn.includes(location.pathname);

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <AuthProvider>
      <div className={`${darkMode ? 'dark' : ''}`}>
        <div className="App min-h-screen bg-gradient-to-tr from-[#f9f7f3] to-[#fffefc] dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500 flex flex-col">

          {/* Dark Mode Toggle */}
          <div className="p-4 text-right">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:backdrop-blur-md hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 shadow-md dark:shadow-lg ring-1 ring-inset ring-gray-200 dark:ring-gray-700"
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-yellow-400 drop-shadow" />
                  <span className="text-sm font-medium">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-gray-800 dark:text-white drop-shadow" />
                  <span className="text-sm font-medium">Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Auth Tabs */}
          {shouldShowAuthTabs && <AuthTabs />}

          {/* Main Routes */}
          <div className="transition-opacity duration-300 ease-in-out flex-grow">
            <AppRoutes />
          </div>

          {/* Elegant Footer */}
          <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 pt-10 pb-6 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Campus Nest</h3>
                  <p className="text-sm leading-relaxed">
                    Premium off-campus housing listings for students. Find your perfect space effortlessly.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Company</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">About Us</a></li>
                    <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Careers</a></li>
                    <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Resources</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Help Center</a></li>
                    <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Terms of Service</a></li>
                  </ul>
                </div>
                <div>
                  {/* <h4 className="font-medium text-gray-900 dark:text-white mb-3">Follow Us</h4> */}
                  <div className="flex space-x-4">
                    {[
                      { name: 'Facebook', icon: 'facebook' },
                      { name: 'Twitter', icon: 'twitter' },
                      { name: 'Instagram', icon: 'instagram' },
                    ].map(({ name, icon }) => (
                      <a key={name} href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition" aria-label={name}>
                        <i className={`fab fa-${icon} text-xl`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-6 text-center text-sm">
                &copy; {new Date().getFullYear()} Campus Nest. All rights reserved.
              </div>
            </div>
          </footer>

        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
