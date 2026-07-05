import axiosClient from "./axiosClient";

export const wishlistApi = {
  getAll: async () => {
    const res = await axiosClient.get("/wishlist");
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/wishlist/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post("/wishlist", data);
    return res.data;
  },

  remove: async (id) => {
    await axiosClient.delete(`/wishlist/${id}`);
  },
};
