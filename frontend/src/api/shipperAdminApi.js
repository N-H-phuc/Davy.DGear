import axiosClient from "./axiosClient";

export const shipperAdminApi = {
  getAll: async () => {
    const res = await axiosClient.get("/users/shippers");
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post("/users/shippers", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosClient.put(`/users/shippers/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    await axiosClient.delete(`/users/shippers/${id}`);
  },
};
