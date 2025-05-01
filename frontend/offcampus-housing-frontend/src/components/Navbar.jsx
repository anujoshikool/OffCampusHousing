// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { logoutUser } from '../services/Authapi';


// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { firstName } = location.state || {}; // Retrieve firstName from state

//   const [showDropdown, setShowDropdown] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [message, setMessage] = useState(""); // Message for logout status
//   const [messageType, setMessageType] = useState(""); // success/error message type

//   const dropdownRef = useRef(null);
//   const iconRef = useRef(null);
//   const searchRef = useRef(null);

//   // Toggle dropdown
//   const toggleDropdown = () => setShowDropdown(!showDropdown);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         iconRef.current &&
//         !iconRef.current.contains(event.target) &&
//         searchRef.current &&
//         !searchRef.current.contains(event.target)
//       ) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Handle user logout
//   const handleLogout = async () => {
//     try {
//       const response = await logoutUser();
//       setMessage(response.message || "Successfully logged out");
//       setMessageType("success");

//       // Redirect to login after a short delay
//       setTimeout(() => {
//         navigate("/");
//       }, 1000);
//     } catch (error) {
//       console.error("Logout failed:", error);
//       setMessage("Logout failed! Please try again.");
//       setMessageType("error");
//     }
//   };

//   // If firstName is not provided, display a message
//   if (!firstName) {
//     return <div className="text-center mt-10 text-red-500">No user data found</div>;
//   }

//   return (
//     <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center relative">
//       <h1 className="text-xl font-semibold">Seller Dashboard</h1>

//       {/* Search Bar */}
//       <div ref={searchRef} className="flex items-center bg-gray-800 px-3 py-2 rounded-md">
//         <input
//           type="text"
//           className="bg-transparent text-white focus:outline-none w-64"
//           placeholder="Search properties..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* Profile Section */}
//       <div className="relative flex items-center gap-4" ref={iconRef}>
//         <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
//           <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
//             <span className="font-bold text-lg">{firstName[0]}</span>
//           </div>
//           <span className="text-lg font-medium text-blue-400">{firstName}</span>
//         </div>

//         {/* Dropdown */}
//         {showDropdown && (
//           <div ref={dropdownRef} className="absolute right-0 mt-20 w-40 bg-white border rounded shadow-lg z-10">
//             <ul>
//               <li className="px-4 py-2 cursor-pointer text-black hover:bg-gray-100" onClick={handleLogout}>
//                 Logout
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>

//      {/* Message Display */}
//      {message && (
//           <div
//             className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 text-white rounded-lg shadow-lg z-50 ${
//             messageType === "success" ? "bg-green-500" : "bg-red-500"
//             }`}
//           >
//             {message}
//           </div>
//         )}
//     </nav>
//   );
// };

// export default Navbar;





import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from '../services/Authapi';


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { firstName,userType } = location.state || {}; // Retrieve firstName from state
    //console.log("USER TYPE: ",userType);

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState(""); // Message for logout status
  const [messageType, setMessageType] = useState(""); // success/error message type

  const dropdownRef = useRef(null);
  const iconRef = useRef(null);
  const searchRef = useRef(null);

  // Toggle dropdown
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle user logout
  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      setMessage(response.message || "Successfully logged out");
      setMessageType("success");

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Logout failed:", error);
      setMessage("Logout failed! Please try again.");
      setMessageType("error");
    }
  };

  // If firstName is not provided, display a message
  if (!firstName) {
    return <div className="text-center mt-10 text-red-500">No user data found</div>;
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center relative">
      <h1 className="text-xl font-semibold">{userType} Dashboard</h1>

      {/* Search Bar */}
      <div ref={searchRef} className="flex items-center bg-gray-800 px-3 py-2 rounded-md">
        <input
          type="text"
          className="bg-transparent text-white focus:outline-none w-64"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Profile Section */}
      <div className="relative flex items-center gap-4" ref={iconRef}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <span className="font-bold text-lg">{firstName[0]}</span>
          </div>
          <span className="text-lg font-medium text-blue-400">{firstName}</span>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div ref={dropdownRef} className="absolute right-0 mt-20 w-40 bg-white border rounded shadow-lg z-10">
            <ul>
              <li className="px-4 py-2 cursor-pointer text-black hover:bg-gray-100" onClick={handleLogout}>
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 text-white rounded-lg shadow-lg z-50 ${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
