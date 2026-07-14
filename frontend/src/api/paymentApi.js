import axiosClient from "./axiosClient";

export const paymentsApi = {
  // Tạo Payment
  async create(data) {
    const res = await axiosClient.post("/payments", data);
    return res.data;
  },

  // Lấy Payment theo Order
  async getByOrder(orderId) {
    const res = await axiosClient.get(`/payments/order/${orderId}`);
    return res.data;
  },

  // Admin cập nhật trạng thái
  async updateStatus(id, status) {
    const res = await axiosClient.put(`/payments/${id}?status=${status}`);
    return res.data;
  },

  // Danh sách Payment
  async getAll() {
    const res = await axiosClient.get("/payments");
    return res.data;
  },

  // ==========================
  // STRIPE
  // ==========================

  async createStripeSession(orderId) {
    const res = await axiosClient.post("/payments/stripe/create-session", {
      order_id: orderId,
      payment_method: "stripe",
    });

    return res.data;
  },

  async confirmPayment(orderId) {
    const res = await axiosClient.post("/payments/confirm", {
      order_id: orderId,
      provider: "stripe",
    });

    return res.data;
  },
};
