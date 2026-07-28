import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ordersService } from '../api/services';
import { useAuth } from './AuthContext';

const OrdersContext = createContext(undefined);

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    try {
      // Limit to 10 most recent orders on initial load — prevents unbounded fetches
      const res = await ordersService.getOrders({ limit: 10, page: 1 });
      setOrders(res.data.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = useCallback(async (orderData) => {
    if (!user) return;
    try {
      await ordersService.createOrder(orderData);
      await fetchOrders();
    } catch (err) {
      console.error('Failed to create order', err);
      throw err;
    }
  }, [user, fetchOrders]);

  const value = useMemo(() => ({
    orders,
    addOrder,
    fetchOrders,
  }), [orders, addOrder, fetchOrders]);

  return (
    <OrdersContext.Provider value={value}>
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
