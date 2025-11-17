import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/routing/PrivateRoute';
import AdminRoute from './components/common/routing/AdminRoute';
import DashboardLayout from './components/common/layouts/DashboardLayout';
// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage'; // Refactored AuthPage
import LoginPage from './pages/LoginPage'; // New page
import RegisterPage from './pages/RegisterPage'; // New page
import DashboardPage from './pages/DashboardPage';
import PlaygroundPage from './pages/PlaygroundPage';
import InternalFunctionsPage from './pages/InternalFunctionsPage.jsx';
import PricingPage from './pages/PricingPage';
import SettingsPage from './pages/SettingsPage';
import BillingPage from './pages/BillingPage';
import LogsPage from './pages/LogsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DocsPage from './pages/DocsPage';
import './tailwind.css'; // Keep your existing App.css if needed, or replace with Tailwind setup
import toast, { Toaster } from 'react-hot-toast';

function App() {
  return (<>
    <Toaster  toastOptions={{
    // Define default options
    className: '',
    duration: 5000,
    removeDelay: 1000,
  

    // Default options for specific types
    success: {
      duration: 3000,
      iconTheme: {
        primary: 'green',
        secondary: 'black',
      },
    },
  }}  />
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/docs" element={<DocsPage />} />
          
            {/* Authentication Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/playground" element={<PrivateRoute><PlaygroundPage /></PrivateRoute>} />
          <Route path="/manage-function" element={<PrivateRoute><InternalFunctionsPage /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path="/billing" element={<PrivateRoute><BillingPage /></PrivateRoute>} />
          <Route path="/pricing" element={<PrivateRoute><PricingPage /></PrivateRoute>} />
          <Route path="/logs" element={<PrivateRoute><LogsPage /></PrivateRoute>} />
          
          {/* Admin-Only Route */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
    </>
  );
}

export default App;







