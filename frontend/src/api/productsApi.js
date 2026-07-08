import axiosClient from "./axiosClient";
import { handleApiError } from "./errorHandler";

export const productsApi = {
  async getAll(
    page = 1,
    limit = 8,
    search = "",
    category = "All",
    sort = "none"
  ) {
    try {
      const response = await axiosClient.get("/products", {
        params: {
          page,
          limit,
          search,
          category,
          sort,
        },
      });

      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch products");
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await axiosClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch product");
      throw error;
    }
  },

  async create(product) {
    try {
      const response = await axiosClient.post("/products", product);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to create product");
      throw error;
    }
  },

  async update(id, product) {
    try {
      const response = await axiosClient.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to update product");
      throw error;
    }
  },

  async delete(id) {
    try {
      await axiosClient.delete(`/products/${id}`);
    } catch (error) {
      handleApiError(error, "Failed to delete product");
      throw error;
    }
  },

  async getFlashSale() {
    try {
      const response = await axiosClient.get("/products/flash-sale");
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch flash sale");
      throw error;
    }
  },

  async getBestSellers() {
    try {
      const response = await axiosClient.get("/products/best-sellers");
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch best sellers");
      throw error;
    }
  },
};
