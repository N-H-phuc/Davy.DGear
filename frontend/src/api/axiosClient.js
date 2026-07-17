import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

// Thêm token vào Header
// axiosClient.interceptors.request.use((config) => {
//   const isAdminApi =
//     config.url?.startsWith("/admin") || config.url?.includes("/admin");

//   const token = isAdminApi
//     ? localStorage.getItem("adminToken")
//     : localStorage.getItem("customerToken");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

axiosClient.interceptors.request.use((config) => {
  const isAdminApi =
    config.url?.startsWith("/admin") ||
    config.url?.includes("/admin") ||
    config.url?.includes("/orders/assign-shipper");

  const token = isAdminApi
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("customerToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Xử lý lỗi
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status !== 401) {
      console.log("API Error:", error.response?.status, error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
