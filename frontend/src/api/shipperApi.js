import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("shipperToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ======================
// Dashboard
// ======================

export const getDashboard = () => API.get("/shipper/dashboard");

// ======================
// Orders
// ======================

export const getMyOrders = () => API.get("/shipper/my-orders");

export const getHistory = () => API.get("/shipper/history");

export const getOrderDetail = (id) => API.get(`/shipper/order/${id}`);

// ======================
// Actions
// ======================

export const pickupOrder = (id) => API.put(`/shipper/pickup/${id}`);

export const shippingOrder = (id) => API.put(`/shipper/shipping/${id}`);

export const deliverOrder = (id) => API.put(`/shipper/deliver/${id}`);

export const failedOrder = (id, reason) =>
  API.put(`/shipper/failed/${id}`, null, {
    params: {
      reason,
    },
  });

// ======================
// Upload
// ======================

export const uploadProof = (id, file) => {
  const formData = new FormData();

  formData.append("image", file);

  return API.post(`/shipper/upload-proof/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ======================
// OTP
// ======================

export const verifyOTP = (id, otp_code) =>
  API.put(`/shipper/verify-otp/${id}`, {
    otp_code,
  });

// ======================
// Income
// ======================

export const getTodayIncome = () => API.get("/shipper/income/today");

export const getMonthIncome = () => API.get("/shipper/income/month");

// ======================
// Profile
// ======================

export const getProfile = () => API.get("/shipper/profile");
