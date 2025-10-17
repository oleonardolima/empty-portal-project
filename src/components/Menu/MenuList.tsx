import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { menuItems } from '../../data/menuData';
import { useOrderStore } from '../../store/useOrderStore';

const MenuList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<MenuItem['category'] | 'all'>('all');
  const { addItem } = useOrderStore();

  const categories = ['all', 'appetizers', 'mains', 'desserts', 'beverages'] as const;
  const categoryLabels = {
    all: 'All Items',
    appetizers: 'Appetizers',
    mains: 'Main Courses',
    desserts: 'Desserts',
    beverages: 'Beverages',
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddItem = (item: MenuItem) => {
    addItem(item, 1);
  };

  const formatPrice = (millisats: number) => {
    const sats = millisats / 1000;
    return `${sats.toLocaleString()} sats`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Our Menu</h2>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              !item.available ? 'opacity-60' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">
                {categoryLabels[item.category]}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4">{item.description}</p>

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(item.price)}
              </span>

              {item.available ? (
                <button
                  onClick={() => handleAddItem(item)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add to Order
                </button>
              ) : (
                <span className="text-red-600 font-medium">Unavailable</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuList;