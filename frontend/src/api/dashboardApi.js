import axiosClient from "./axiosClient";

export const dashboardApi = {
  // ==========================
  // Dashboard Statistics
  // ==========================
  async getStatistics() {
    const [users, products, orders, reviews] = await Promise.all([
      axiosClient.get("/users"),
      axiosClient.get("/products"),
      axiosClient.get("/orders"),
      axiosClient.get("/reviews"),
    ]);

    return {
      users: users.data,
      products: products.data,
      orders: orders.data,
      reviews: reviews.data,
    };
  },

  // ==========================
  // Top Selling Products
  // ==========================
  async getTopProducts() {
    const res = await axiosClient.get("/dashboard/top-products");

    return res.data;
  },

  //top customers
  async getTopCustomers() {
    const res = await axiosClient.get("/dashboard/top-customers");

    return res.data;
  },
  // ===================== // REVENUE BY DAY // =====================
  async getRevenueByDay() {
    const res = await axiosClient.get("/dashboard/revenue-by-day");
    return res.data;
  },
  // ===================== // REVENUE BY WEEK // =====================
  async getRevenueByWeek() {
    const res = await axiosClient.get("/dashboard/revenue-by-week");
    return res.data;
  },

  // ===================== // REVENUE BY MONTH // =====================
  async getRevenueByMonth() {
    const res = await axiosClient.get("/dashboard/revenue-by-month");

    return res.data;
  },

  // ===================== // REVENUE BY YEAR // =====================
  async getRevenueByYear() {
    const res = await axiosClient.get("/dashboard/revenue-by-year");
    return res.data;
  },

  async getOrderStatus() {
    const res = await axiosClient.get("/dashboard/order-status");

    return res.data;
  },
};
