export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in millisats
  category: 'appetizers' | 'mains' | 'desserts' | 'beverages';
  image?: string;
  available: boolean;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'paid';
  totalAmount: number; // in millisats
  createdAt: Date;
  customerPubkey?: string;
}

export interface Table {
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder?: Order;
}

export interface AuthState {
  isAuthenticated: boolean;
  pubkey?: string;
  profile?: {
    name?: string;
    picture?: string;
  };
  tableNumber?: number;
}