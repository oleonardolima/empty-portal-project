import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface QRAuthProps {
  tableNumber?: number;
}

const QRAuth: React.FC<QRAuthProps> = ({ tableNumber }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [authUrl, setAuthUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuthenticated, setTableNumber } = useAuthStore();

  useEffect(() => {
    generateAuthQR();
  }, []);

  const generateAuthQR = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch auth URL from backend
      const response = await fetch('/api/auth/generate-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate authentication URL');
      }

      const { url, streamId } = await response.json();
      setAuthUrl(url);

      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(qrDataUrl);

      // Listen for authentication completion
      listenForAuth(streamId);
    } catch (err) {
      console.error('QR generation error:', err);
      setError('Failed to generate QR code. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  };

  const listenForAuth = (streamId: string) => {
    // Poll for authentication status
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/auth/status/${streamId}`);
        const data = await response.json();

        if (data.authenticated) {
          clearInterval(checkInterval);
          setAuthenticated(data.pubkey, data.profile);
          if (tableNumber) {
            setTableNumber(tableNumber);
          }
          navigate('/menu');
        }
      } catch (err) {
        console.error('Auth check error:', err);
      }
    }, 2000); // Check every 2 seconds

    // Clear interval after 5 minutes
    setTimeout(() => clearInterval(checkInterval), 300000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Our Restaurant</h1>
            {tableNumber && (
              <p className="text-lg text-gray-600">Table {tableNumber}</p>
            )}
            <p className="text-gray-600 mt-4">
              Scan the QR code with your Nostr wallet to sign in and start ordering
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={generateAuthQR}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <img src={qrCodeUrl} alt="Authentication QR Code" className="rounded-lg" />
              </div>

              <div className="text-center text-sm text-gray-500">
                <p className="mb-2">Or copy this link:</p>
                <div className="bg-gray-100 p-2 rounded break-all text-xs">
                  {authUrl}
                </div>
              </div>

              <button
                onClick={generateAuthQR}
                className="w-full mt-6 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Generate New QR Code
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRAuth;