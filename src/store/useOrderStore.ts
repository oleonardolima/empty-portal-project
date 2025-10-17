import { create } from 'zustand';
import { OrderItem, MenuItem, Order } from '../types';

interface OrderStore {
  currentOrder: OrderItem[];
  orders: Order[];

  addItem: (item: MenuItem, quantity: number, notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearOrder: () => void;
  getTotalAmount: () => number;
  submitOrder: (tableNumber: number, customerPubkey?: string) => Promise<Order>;
  setOrders: (orders: Order[]) => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  currentOrder: [],
  orders: [],

  addItem: (item, quantity, notes) => {
    set((state) => {
      const existingItem = state.currentOrder.find((oi) => oi.menuItem.id === item.id);
      if (existingItem) {
        return {
          currentOrder: state.currentOrder.map((oi) =>
            oi.menuItem.id === item.id
              ? { ...oi, quantity: oi.quantity + quantity, notes }
              : oi
          ),
        };
      }
      return {
        currentOrder: [...state.currentOrder, { menuItem: item, quantity, notes }],
      };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      currentOrder: state.currentOrder.filter((oi) => oi.menuItem.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      currentOrder: state.currentOrder.map((oi) =>
        oi.menuItem.id === itemId ? { ...oi, quantity } : oi
      ),
    }));
  },

  clearOrder: () => set({ currentOrder: [] }),

  getTotalAmount: () => {
    const { currentOrder } = get();
    return currentOrder.reduce((total, item) =>
      total + (item.menuItem.price * item.quantity), 0
    );
  },

  submitOrder: async (tableNumber, customerPubkey) => {
    const { currentOrder } = get();
    const order: Order = {
      id: `order-${Date.now()}`,
      tableNumber,
      items: currentOrder,
      status: 'pending',
      totalAmount: get().getTotalAmount(),
      createdAt: new Date(),
      customerPubkey,
    };

    // In a real app, this would call the backend API
    set((state) => ({
      orders: [...state.orders, order],
      currentOrder: [],
    }));

    return order;
  },

  setOrders: (orders) => set({ orders }),
}));