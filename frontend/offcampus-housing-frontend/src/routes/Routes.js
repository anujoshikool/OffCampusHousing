// src/routes/Routes.js
import { Routes, Route } from 'react-router-dom';
import VerifyEmail from '../pages/VerifyEmail';
import ResetPassword from '../pages/ResetPassword';
import BuyerDashboard from '../pages/BuyerDashboard';
import SellerProfile from '../pages/SellerDashboardPage';
import MyPropertiesPage from '../pages/MyProperties';
import IndiPropertyDetailsPage from '../pages/IndiPropertyDetailsPage';
import ProtectedRoute from '../components/ProtectedRoute';
import AllBuyerProperties from '../pages/AllBuyerProperties';
import IndiBuyerPropertyDetails from '../pages/IndiBuyerPropertyDetails';
import AuthTabs from '../components/AuthTabs';
import NotFound from '../pages/NotFound';
import AddMyProperty from '../pages/AddMyProperty';
import ProfilePage from '../pages/ProfilePage';
import EditDetails from '../pages/EditDetails'; // ✅ Added import here
import SuccessPage from '../pages/SuccessPage';
import CancelPage from '../pages/CancelPage';
import UpdateMyProperty from '../pages/UpdateMyProperty';
import BuyerSaved from '../pages/BuyerSaved';
import BuyerFavorites from '../pages/BuyerFavorites';
import UserFeedback from '../components/UserFeedback';
import LearnMorePremium from '../pages/LearnMorePremium';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/" element={<AuthTabs />} />
      <Route path="/auth/login" element={<AuthTabs />} />
      <Route path="/auth/register" element={<AuthTabs />} />
      <Route path="/auth/verify" element={<VerifyEmail />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/auth/profile" element={<ProfilePage />} />
      <Route path="/auth/edit-profile" element={<EditDetails />} />
      <Route path="/UserFeedback" element={<UserFeedback />} />
    

      


      {/* Buyer Protected Routes */}
      <Route element={<ProtectedRoute allowedUserType="BUYER" />}>
        <Route path="/api/buyer-properties" element={<BuyerDashboard />} />
        <Route path="/allProperties" element={<AllBuyerProperties />} />
        <Route path="/buyerProperty/:propertyId" element={<IndiBuyerPropertyDetails />} />
        <Route path="/buyer/saved" element={<BuyerSaved />} />
        <Route path="/buyer/favorites" element={<BuyerFavorites />} />
      </Route>

      {/* Seller Protected Routes */}
      <Route element={<ProtectedRoute allowedUserType="SELLER" />}>
        <Route path="/api/seller-properties" element={<SellerProfile />} />
        <Route path="/myProperties" element={<MyPropertiesPage />} />
        <Route path="/myProperties/:propertyId" element={<IndiPropertyDetailsPage />} />
        <Route path="/add-property" element={<AddMyProperty />} />
        <Route path="/success" element={<SuccessPage />} />
      <Route path="/cancel" element={<CancelPage />} />
      <Route path="/update-property/:propertyId" element={<UpdateMyProperty />} />
      <Route path="/learnmore" element={<LearnMorePremium />} />
      
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;