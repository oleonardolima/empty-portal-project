import { MenuItem } from '../types';

export const menuItems: MenuItem[] = [
  // Appetizers
  {
    id: 'app-1',
    name: 'Bruschetta',
    description: 'Toasted bread with tomatoes, garlic, and basil',
    price: 8000, // 8 sats
    category: 'appetizers',
    available: true,
  },
  {
    id: 'app-2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan, croutons, Caesar dressing',
    price: 10000,
    category: 'appetizers',
    available: true,
  },
  {
    id: 'app-3',
    name: 'Garlic Bread',
    description: 'Fresh baked bread with garlic butter and herbs',
    price: 6000,
    category: 'appetizers',
    available: true,
  },

  // Main Courses
  {
    id: 'main-1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, basil',
    price: 18000,
    category: 'mains',
    available: true,
  },
  {
    id: 'main-2',
    name: 'Spaghetti Carbonara',
    description: 'Classic Roman pasta with eggs, cheese, and guanciale',
    price: 22000,
    category: 'mains',
    available: true,
  },
  {
    id: 'main-3',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with lemon butter sauce and vegetables',
    price: 28000,
    category: 'mains',
    available: true,
  },
  {
    id: 'main-4',
    name: 'Ribeye Steak',
    description: '12oz ribeye with roasted potatoes and seasonal vegetables',
    price: 35000,
    category: 'mains',
    available: true,
  },
  {
    id: 'main-5',
    name: 'Vegetable Risotto',
    description: 'Creamy arborio rice with seasonal vegetables',
    price: 20000,
    category: 'mains',
    available: true,
  },

  // Desserts
  {
    id: 'des-1',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 12000,
    category: 'desserts',
    available: true,
  },
  {
    id: 'des-2',
    name: 'Panna Cotta',
    description: 'Vanilla cream with berry compote',
    price: 10000,
    category: 'desserts',
    available: true,
  },
  {
    id: 'des-3',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center',
    price: 14000,
    category: 'desserts',
    available: true,
  },

  // Beverages
  {
    id: 'bev-1',
    name: 'Espresso',
    description: 'Single shot of Italian espresso',
    price: 3000,
    category: 'beverages',
    available: true,
  },
  {
    id: 'bev-2',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 5000,
    category: 'beverages',
    available: true,
  },
  {
    id: 'bev-3',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice',
    price: 6000,
    category: 'beverages',
    available: true,
  },
  {
    id: 'bev-4',
    name: 'Craft Beer',
    description: 'Local craft beer selection',
    price: 8000,
    category: 'beverages',
    available: true,
  },
  {
    id: 'bev-5',
    name: 'House Wine',
    description: 'Red or white house wine by the glass',
    price: 10000,
    category: 'beverages',
    available: true,
  },
];