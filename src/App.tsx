import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './components/Payment/CheckoutPage';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route
        path="/menu"
        element={isAuthenticated ? <MenuPage /> : <Navigate to="/" />}
      />
      <Route
        path="/checkout"
        element={isAuthenticated ? <CheckoutPage /> : <Navigate to="/" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;