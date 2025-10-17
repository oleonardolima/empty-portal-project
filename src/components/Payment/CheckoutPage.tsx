import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pubkey } = useAuthStore();
  const { orders } = useOrderStore();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const [paymentMessage, setPaymentMessage] = useState('');

  const orderId = location.state?.orderId;
  const order = orders.find(o => o.id === orderId);

  useEffect(() => {
    if (!order) {
      navigate('/menu');
    }
  }, [order, navigate]);

  const formatPrice = (millisats: number) => {
    const sats = millisats / 1000;
    return `${sats.toLocaleString()} sats`;
  };

  const handlePayment = async () => {
    if (!pubkey || !order) return;

    try {
      setPaymentStatus('processing');
      setPaymentMessage('Initiating payment through Portal...');

      const response = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.totalAmount,
          pubkey,
          description: `Restaurant Order #${order.id}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment request failed');
      }

      const { streamId } = await response.json();

      // Listen for payment status updates
      checkPaymentStatus(streamId);
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      setPaymentMessage('Payment failed. Please try again.');
    }
  };

  const checkPaymentStatus = (streamId: string) => {
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment/status/${streamId}`);
        const data = await response.json();

        if (data.status === 'paid') {
          clearInterval(checkInterval);
          setPaymentStatus('success');
          setPaymentMessage('Payment successful! Thank you for your order.');
          setTimeout(() => navigate('/order-status'), 3000);
        } else if (data.status === 'failed' || data.status === 'user_rejected') {
          clearInterval(checkInterval);
          setPaymentStatus('failed');
          setPaymentMessage('Payment was declined or failed.');
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    }, 2000);

    // Clear interval after 5 minutes
    setTimeout(() => clearInterval(checkInterval), 300000);
  };

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          {/* Order Summary */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.menuItem.name} x{item.quantity}
                  </span>
                  <span>{formatPrice(item.menuItem.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-lg text-blue-600">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="text-center">
            {paymentStatus === 'pending' && (
              <>
                <p className="text-gray-600 mb-6">
                  Click below to pay with your Nostr wallet
                </p>
                <button
                  onClick={handlePayment}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Pay with Lightning
                </button>
              </>
            )}

            {paymentStatus === 'processing' && (
              <div className="py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{paymentMessage}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Please complete the payment in your wallet
                </p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="py-8">
                <div className="text-green-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-green-600">{paymentMessage}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Redirecting to order status...
                </p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="py-8">
                <div className="text-red-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-red-600">{paymentMessage}</p>
                <button
                  onClick={handlePayment}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('/menu')}
          className="mt-4 text-blue-600 hover:text-blue-700 flex items-center justify-center w-full"
        >
          ← Back to Menu
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;