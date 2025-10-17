import React, { useState } from 'react';
import QRAuth from '../components/Auth/QRAuth';

const AuthPage: React.FC = () => {
  const [tableNumber, setTableNumber] = useState<number | undefined>();
  const [showQR, setShowQR] = useState(false);

  const handleTableSelect = (table: number) => {
    setTableNumber(table);
    setShowQR(true);
  };

  if (showQR && tableNumber) {
    return <QRAuth tableNumber={tableNumber} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Select Your Table
          </h1>

          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((table) => (
              <button
                key={table}
                onClick={() => handleTableSelect(table)}
                className="bg-blue-600 text-white text-xl font-bold py-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {table}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowQR(true)}
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Continue without table number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;