import React, { createContext, useContext, useState, useEffect } from 'react';
import { products } from '../data/products';

/* ==========================================================================
   Orders Context
   - Manages list of orders placed by the user
   - Initialized with realistic past orders using actual product data
   - Persists state in Local Storage under 'mobimart_orders'
   ========================================================================== */

const OrdersContext = createContext(undefined);

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem('mobimart_orders');
    if (stored) return JSON.parse(stored);

    // Default mock orders using real products from our database
    const p1 = products.find(p => p.id === '1') || products[0]; // iPhone 15 Pro
    const p2 = products.find(p => p.id === '4') || products[0]; // Samsung S24 Ultra
    const p3 = products.find(p => p.id === '8') || products[0]; // Pixel 8 Pro

    return [
      {
        orderId: 'MM240101',
        purchaseDate: '10 May 2026',
        status: 'Delivered', // Delivered, Shipped, Packed, Pending, Cancelled
        product: p1,
        selectedStorage: '256GB',
        selectedColor: 'Natural Titanium',
        quantity: 1,
        total: 89999,
        deliveryMethod: 'standard',
        paymentMethod: 'upi',
      },
      {
        orderId: 'MM240102',
        purchaseDate: '14 Jun 2026',
        status: 'Shipped',
        product: p2,
        selectedStorage: '512GB',
        selectedColor: 'Titanium Grey',
        quantity: 1,
        total: 124999,
        deliveryMethod: 'express',
        paymentMethod: 'credit',
      },
      {
        orderId: 'MM240103',
        purchaseDate: '18 Jul 2026',
        status: 'Pending',
        product: p3,
        selectedStorage: '128GB',
        selectedColor: 'Bay Blue',
        quantity: 1,
        total: 59999,
        deliveryMethod: 'standard',
        paymentMethod: 'cod',
      }
    ];
  });

  // Sync with Local Storage whenever orders change
  useEffect(() => {
    localStorage.setItem('mobimart_orders', JSON.stringify(orders));
  }, [orders]);

  // Add a new order
  const addOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

export default OrdersContext;
