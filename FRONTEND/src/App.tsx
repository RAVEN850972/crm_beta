import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { useGetCurrentUserQuery } from './store/api/authApi';
import { setUser, clearUser, setLoading } from './store/slices/authSlice';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ClientsPage from './pages/clients/ClientsPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import ServicesPage from './pages/services/ServicesPage';
import FinancePage from './pages/finance/FinancePage';
import CalendarPage from './pages/calendar/CalendarPage';
import SalaryConfigPage from './pages/salary/SalaryConfigPage';
import SettingsPage from './pages/settings/SettingsPage';

// Components
import LoadingSpinner from './components/common/LoadingSpinner';
import NotificationContainer from './components/common/NotificationContainer';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Styles
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const { data: currentUser, error, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: isAuthenticated,
  });

  useEffect(() => {
    if (currentUser) {
      dispatch(setUser(currentUser));
    } else if (error) {
      dispatch(clearUser());
    }
    dispatch(setLoading(false));
  }, [currentUser, error, dispatch]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : (
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            )
          } />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* Clients */}
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            
            {/* Orders */}
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            
            {/* Services */}
            <Route path="services" element={<ServicesPage />} />
            
            {/* Finance */}
            <Route path="finance" element={
              <ProtectedRoute requiredRoles={['owner']}>
                <FinancePage />
              </ProtectedRoute>
            } />
            
            {/* Calendar */}
            <Route path="calendar" element={<CalendarPage />} />
            
            {/* Salary Config */}
            <Route path="salary-config" element={
              <ProtectedRoute requiredRoles={['owner']}>
                <SalaryConfigPage />
              </ProtectedRoute>
            } />
            
            {/* Settings */}
            <Route path="settings" element={
              <ProtectedRoute requiredRoles={['owner']}>
                <SettingsPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        
        <NotificationContainer />
      </ErrorBoundary>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;