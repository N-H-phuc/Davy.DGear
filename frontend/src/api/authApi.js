import axiosClient from "./axiosClient";

export const authApi = {
  async login(data) {
    const response = await axiosClient.post("/auth/login", data);
    return response.data;
  },
  register: async (data) => {
    const res = await axiosClient.post("/auth/register", data);
    return res.data;
  },
};
