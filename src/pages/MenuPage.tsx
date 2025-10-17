import React from 'react';
import MenuList from '../components/Menu/MenuList';
import OrderSummary from '../components/Order/OrderSummary';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const MenuPage: React.FC = () => {
  const { isAuthenticated, profile, tableNumber, logout } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Portal</h1>
              {tableNumber && (
                <p className="text-sm text-gray-600">Table {tableNumber}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {profile?.name && (
                <span className="text-gray-700">Welcome, {profile.name}</span>
              )}
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <MenuList />
          </div>

          {/* Order Summary - 1 column on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;