import axiosClient from "./axiosClient";

export const reviewApi = {
  getAll: async () => {
    const res = await axiosClient.get("/reviews");
    return res.data;
  },

  getByProduct: async (productId) => {
    const res = await axiosClient.get(`/reviews/product/${productId}`);
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/reviews/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post("/reviews", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosClient.put(`/reviews/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    await axiosClient.delete(`/reviews/${id}`);
  },
};
