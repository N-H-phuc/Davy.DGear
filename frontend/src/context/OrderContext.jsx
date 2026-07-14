import { createContext, useContext, useEffect, useState } from "react";

import { ordersApi } from "../api/ordersApi";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  // ==========================
  // LOAD ORDERS
  // ==========================

  const loadOrders = async () => {
    const token = localStorage.getItem("customerToken");

    if (!token) {
      setOrders([]);
      return;
    }

    try {
      const data = await ordersApi.getMyOrders();
      setOrders(data);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.log(err);
      }

      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ==========================
  // CREATE ORDER (CHECKOUT)
  // ==========================

  const createOrder = async (orderData) => {
    try {
      const order = await ordersApi.create(orderData);

      await loadOrders();

      return order;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  // ==========================
  // DELETE ORDER
  // ==========================

  const deleteOrder = async (id) => {
    try {
      await ordersApi.delete(id);

      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // UPDATE STATUS
  // ==========================

  const updateStatus = async (id, status) => {
    try {
      await ordersApi.updateStatus(id, status);

      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loadOrders,
        createOrder,
        deleteOrder,
        updateStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}
