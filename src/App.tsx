import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from './components/common/LoadingScreen';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Lazy load pages to improve initial load performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AddFundsPage = lazy(() => import('./pages/AddFundsPage'));
const WithdrawPage = lazy(() => import('./pages/WithdrawPage'));
const SendMoneyPage = lazy(() => import('./pages/SendMoneyPage'));
const TransactionPage = lazy(() => import('./pages/TransactionPage'));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/add-funds" element={<AddFundsPage />} />
              <Route path="/withdraw" element={<WithdrawPage />} />
              <Route path="/send" element={<SendMoneyPage />} />
              <Route path="/transaction/:id" element={<TransactionPage />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;