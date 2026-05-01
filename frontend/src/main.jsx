import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import FAQ from './components/FAQ';
import Contact from './components/Contact';

// Lazy-load admin pages
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ProductsPage = lazy(() => import('./pages/admin/ProductsPage'));
const ContactsPage = lazy(() => import('./pages/admin/ContactsPage'));
const QuotesPage = lazy(() => import('./pages/admin/QuotesPage'));
const LeadsPage = lazy(() => import('./pages/admin/LeadsPage'));
const FaqsPage = lazy(() => import('./pages/admin/FaqsPage'));
const VisitorsPage = lazy(() => import('./pages/admin/VisitorsPage'));
const PagesPage = lazy(() => import('./pages/admin/PagesPage'));
const MediaPage = lazy(() => import('./pages/admin/MediaPage'));
const ActivityPage = lazy(() => import('./pages/admin/ActivityPage'));
const SecurityPage = lazy(() => import('./pages/admin/SecurityPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded">Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

function PublicSite() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <About />
      <FAQ />
      <Contact />
    </div>
  );
}

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public website */}
            <Route path="/" element={<PublicSite />} />

            {/* Admin login */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Protected admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute><AdminLayout /></ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="quotes" element={<QuotesPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="faqs" element={<FaqsPage />} />
              <Route path="visitors" element={<VisitorsPage />} />
              <Route path="pages" element={<PagesPage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route path="security" element={<SecurityPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
);
