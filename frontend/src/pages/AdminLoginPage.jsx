import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { authApi } from "../api/authApi";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await authApi.login(form);

      // Chỉ admin mới được đăng nhập
      if (res.user.role !== "admin") {
        alert("Only administrators can login here.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.access_token);
      localStorage.setItem("user", JSON.stringify(res.user));

      alert("Admin login successfully!");

      navigate("/admin");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.detail || "Login failed");
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🛡️</div>

          <h1 className="text-4xl font-bold text-gray-800">Admin Login</h1>

          <p className="text-gray-500 mt-3">
            Sign in to access the ShopHub Dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@email.com"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition"
          >
            {loading ? "Signing In..." : "Login as Admin"}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            ← Back to Customer Login
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AdminLoginPage;
