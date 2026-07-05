import axiosClient from "./axiosClient";

export const categoriesApi = {
  getAll: async () => {
    const res = await axiosClient.get("/categories");
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/categories/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post("/categories", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosClient.put(`/categories/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    await axiosClient.delete(`/categories/${id}`);
  },
};
