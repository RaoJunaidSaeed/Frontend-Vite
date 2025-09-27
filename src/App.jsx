// // App.jsx
// import React from 'react';
// import 'react-toastify/dist/ReactToastify.css';
// import PrivateRoute from './context/PrivateRoute';
// import { ToastContainer } from 'react-toastify';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LandingPage from './pages/LandingPage';
// import Signup from './components/Signup';
// import Login from './components/Login';
// import OwnerDashboard from './pages/OwnerDashboard';
// import PaymentPage from './pages/PaymentPage';
// import ListPropertyPage from './pages/ListPropertyPage'; // adjust the path if it's in a different folder
// import PropertyDetails from './pages/PropertyDetails';
// import UserProfile from './pages/UserProfile';
// import MyBookings from './pages/MyBookings';
// import TenantDashboard from './pages/TenantDashboard';
// import TenantRentPayment from './pages/TenantRentPayment';
// import TenantPaymentHistory from './pages/TenantPaymentHistory';
// import OwnerPaymentHistory from './pages/OwnerPaymentHistory';
// import SettingsPage from './pages/SettingsPage';

// import ResetPassword from './components/ResetPassword';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import LoadingOverlay from './components/LoadingOverlay';
// import RequestsSection from './components/RequestsSection';

// function App() {
//   return (
//     <Router>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Navbar />
//       <LoadingOverlay />
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/reset-password/:token" element={<ResetPassword />} />
//         {/* <Route path="/property/" element={<PropertyDetails />} /> */}
//         <Route path="/property/:id" element={<PropertyDetails />} />
//         {/* <Route path="/owner-dashboard" element={<OwnerDashboard />} /> */}
//         {/* Protected Routes */}
//         <Route element={<PrivateRoute />}>
//           <Route path="/owner-dashboard" element={<OwnerDashboard />} />
//           <Route path="/owner-dashboard/requests" element={<RequestsSection />} />
//           <Route path="/owner-payment-history" element={<OwnerPaymentHistory />} />
//           <Route path="/payment/:planId" element={<PaymentPage />} />
//           <Route path="/payment" element={<PaymentPage />} />
//           <Route path="/add-property" element={<ListPropertyPage />} />
//           <Route path="/profile" element={<UserProfile />} />
//           <Route path="/tenant-dashboard" element={<TenantDashboard />} />
//           <Route path="/my-bookings" element={<MyBookings />} />
//           <Route path="/rent-payment/:propertyId" element={<TenantRentPayment />} />
//           <Route path="/tenant-payment-history" element={<TenantPaymentHistory />} />
//           <Route path="/owner-payment-history" element={<OwnerPaymentHistory />} />
//           <Route path="/settings" element={<SettingsPage />} />
//         </Route>
//       </Routes>
//       <Footer />
//     </Router>
//   );
// }

// export default App;

// App.jsx
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './context/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './components/Signup';
import Login from './components/Login';
import OwnerDashboard from './pages/OwnerDashboard';
import PaymentPage from './pages/PaymentPage';
import ListPropertyPage from './pages/ListPropertyPage';
import PropertyDetails from './pages/PropertyDetails';
import UserProfile from './pages/UserProfile';
import MyBookings from './pages/MyBookings';
import TenantDashboard from './pages/TenantDashboard';
import TenantRentPayment from './pages/TenantRentPayment';
import TenantPaymentHistory from './pages/TenantPaymentHistory';
import OwnerPaymentHistory from './pages/OwnerPaymentHistory';
import SettingsPage from './pages/SettingsPage';
import ResetPassword from './components/ResetPassword';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingOverlay from './components/LoadingOverlay';
import RequestsSection from './components/RequestsSection';

function Layout({ children }) {
  const location = useLocation();

  // hide navbar + footer on settings page
  const hideLayout = location.pathname === '/settings';

  return (
    <>
      {!hideLayout && <Navbar />}
      <LoadingOverlay />
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route element={<PrivateRoute />}>
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/owner-dashboard/requests" element={<RequestsSection />} />
            <Route path="/owner-payment-history" element={<OwnerPaymentHistory />} />
            <Route path="/payment/:planId" element={<PaymentPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/add-property" element={<ListPropertyPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/tenant-dashboard" element={<TenantDashboard />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/rent-payment/:propertyId" element={<TenantRentPayment />} />
            <Route path="/tenant-payment-history" element={<TenantPaymentHistory />} />
            <Route path="/owner-payment-history" element={<OwnerPaymentHistory />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
