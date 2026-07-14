import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// USER PAGES
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import RegisterPage from "./pages/RegisterPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import UserPage from "./pages/UserPage";
import UserDetail from "./pages/UserDetail";
import ProfilePage from "./pages/ProfilePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
// ADMIN
import AdminLayout from "./components/admin/AdminLayout";

import Dashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/UsersPage";
import ProductsPage from "./pages/admin/ProductsPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import VoucherPage from "./pages/admin/VoucherPage";
import OrdersManagementPage from "./pages/admin/OrdersPage";
import ReviewsPage from "./pages/admin/ReviewsPage";
import AdminRoute from "./components/AdminRoute";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";

function App() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");
  return (
    <>
      {/* <Header title="ShopHub" /> */}
      {!isAdminPage && <Header title="ShopHub" />}
      <Routes>
        {/* USER */}

        <Route path="/" element={<HomePage />} />

        <Route path="/products" element={<ProductPage />} />

        <Route path="/products/:id" element={<ProductDetailPage />} />

        <Route path="/cart" element={<CartPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/wishlist" element={<WishlistPage />} />

        <Route path="/checkout" element={<CheckoutPage />} />

        <Route path="/orders" element={<OrdersPage />} />

        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route
          path="/payment/stripe/success"
          element={<PaymentSuccessPage />}
        />

        <Route path="/payment/stripe/cancel" element={<PaymentCancelPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <UserDetail />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="users" element={<UsersPage />} />

          <Route path="products" element={<ProductsPage />} />

          <Route path="categories" element={<CategoriesPage />} />

          <Route path="vouchers" element={<VoucherPage />} />

          <Route path="orders" element={<OrdersManagementPage />} />

          <Route path="/admin/payments" element={<AdminPaymentsPage />} />

          <Route path="reviews" element={<ReviewsPage />} />
        </Route>

        {/* 404 */}

        <Route
          path="*"
          element={<h2 style={{ padding: 30 }}>Page Not Found</h2>}
        />
      </Routes>
    </>
  );
}

export default App;
