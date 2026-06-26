import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Dynamic Page Imports (Code Splitting - L-07)
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const BookingPage = React.lazy(() => import('./pages/BookingPage'));
const ReschedulePage = React.lazy(() => import('./pages/ReschedulePage'));
const CheckBookingPage = React.lazy(() => import('./pages/CheckBookingPage'));
const RatingPage = React.lazy(() => import('./pages/RatingPage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = React.lazy(() => import('./pages/BlogDetailPage'));
const PackagesPage = React.lazy(() => import('./pages/PackagesPage'));
const GalleryPage = React.lazy(() => import('./pages/GalleryPage'));
const FacilitiesPage = React.lazy(() => import('./pages/FacilitiesPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsConditionsPage = React.lazy(() => import('./pages/TermsConditionsPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Dynamic Loading Fallback Spinner
const LoadingSpinner = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-background text-primary">
    <span className="material-symbols-outlined text-4xl animate-spin">settings</span>
  </div>
);

// ProtectedRoute with Auth Loading Check (S-10)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/facilities" element={<FacilitiesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-conditions" element={<TermsConditionsPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/reschedule" element={<ReschedulePage />} />
              <Route path="/cek-tiket" element={<CheckBookingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rating/:bookingRef"
                element={<RatingPage />}
              />
            
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </React.Suspense>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
