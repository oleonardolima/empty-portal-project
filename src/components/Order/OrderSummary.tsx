import React, { useState } from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const OrderSummary: React.FC = () => {
  const { currentOrder, removeItem, updateQuantity, getTotalAmount, submitOrder } = useOrderStore();
  const { pubkey, tableNumber } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (millisats: number) => {
    const sats = millisats / 1000;
    return `${sats.toLocaleString()} sats`;
  };

  const handleSubmitOrder = async () => {
    if (!tableNumber) {
      alert('Please select a table number first');
      return;
    }

    try {
      setIsSubmitting(true);
      const order = await submitOrder(tableNumber, pubkey);

      // Send order to backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        navigate('/checkout', { state: { orderId: order.id } });
      }
    } catch (error) {
      console.error('Failed to submit order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentOrder.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Your Order</h3>
        <p className="text-gray-500 text-center py-8">No items in your order yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Your Order</h3>

      <div className="space-y-4 mb-6">
        {currentOrder.map((item) => (
          <div key={item.menuItem.id} className="border-b pb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium">{item.menuItem.name}</h4>
                <p className="text-sm text-gray-600">
                  {formatPrice(item.menuItem.price)} each
                </p>
                {item.notes && (
                  <p className="text-sm text-gray-500 italic mt-1">{item.notes}</p>
                )}
              </div>
              <button
                onClick={() => removeItem(item.menuItem.id)}
                className="text-red-600 hover:text-red-700 ml-2"
              >
                Remove
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <span className="font-medium">
                {formatPrice(item.menuItem.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(getTotalAmount())}
          </span>
        </div>

        {tableNumber && (
          <p className="text-sm text-gray-600 mb-2">Table: {tableNumber}</p>
        )}

        <button
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className={`w-full py-3 rounded-md font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Order'}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;