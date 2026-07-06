import axiosClient from "./axiosClient";

export const ordersApi = {
  getAll: async () => {
    const res = await axiosClient.get("/orders");
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/orders/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post("/orders", data);
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await axiosClient.put(
      `/orders/${id}/status?status_value=${status}`
    );
    return res.data;
  },

  delete: async (id) => {
    await axiosClient.delete(`/orders/${id}`);
  },

  getMyOrders: async () => {
    const res = await axiosClient.get("/orders/my");
    return res.data;
  },
};
