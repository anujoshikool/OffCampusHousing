

import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedUserType }) => {
  const { user,loading } = useContext(AuthContext);

  console.log('User:', user);
  console.log('Allowed User Type:', allowedUserType);


  if (loading) {
    return <div>Loading...</div>;  // Optionally, display a loading screen during the check
  }


  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedUserType && user.userType !== allowedUserType) {
    return (
        
    <h1 className="text-red-600 text-center mt-10">Access Denied. </h1>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
