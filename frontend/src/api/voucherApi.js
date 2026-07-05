import axiosClient from "./axiosClient";

export const voucherApi = {
  getAll: async () => {
    const res = await axiosClient.get("/vouchers");
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/vouchers/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post("/vouchers", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosClient.put(`/vouchers/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    await axiosClient.delete(`/vouchers/${id}`);
  },

  apply: async (data) => {
    const res = await axiosClient.post("/vouchers/apply", data);
    return res.data;
  },
};
