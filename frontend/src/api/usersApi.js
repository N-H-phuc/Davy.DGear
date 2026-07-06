import axiosClient from "./axiosClient";
import { handleApiError } from "./errorHandler";

export const usersApi = {
  // =====================
  // GET ALL
  // =====================
  async getAll() {
    try {
      const response = await axiosClient.get("/users");

      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch users");

      throw error;
    }
  },

  // =====================
  // GET BY ID
  // =====================
  async getById(id) {
    try {
      const response = await axiosClient.get(`/users/${id}`);

      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch user");

      throw error;
    }
  },

  // =====================
  // CREATE
  // =====================
  async create(data) {
    try {
      const response = await axiosClient.post("/users", data);

      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to create user");

      throw error;
    }
  },

  // =====================
  // UPDATE
  // =====================
  async update(id, data) {
    try {
      const response = await axiosClient.put(`/users/${id}`, data);

      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to update user");

      throw error;
    }
  },

  // =====================
  // DELETE
  // =====================
  async remove(id) {
    try {
      const response = await axiosClient.delete(`/users/${id}`);

      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to delete user");

      throw error;
    }
  },

  // profile
  changePassword: async (id, data) => {
    const res = await axiosClient.put(`/users/${id}/change-password`, data);

    return res.data;
  },
};
