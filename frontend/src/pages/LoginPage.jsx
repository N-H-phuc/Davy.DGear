import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await authApi.login({
        email,
        password,
      });

      // Chặn Admin đăng nhập từ Customer Login
      if (res.user.role === "admin") {
        alert("Administrator accounts must login from the Admin Login page.");

        return;
      }

      // Chỉ Customer mới lưu token
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("user", JSON.stringify(res.user));

      alert("Login successfully!");

      navigate("/");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.detail || "Email or password is incorrect!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">
        {/* Logo */}

        <div className="text-center">
          <div className="text-6xl">🛍️</div>

          <h1 className="text-4xl font-bold text-blue-600 mt-3">ShopHub</h1>

          <p className="text-gray-500 mt-3">
            Welcome back! Login to your account.
          </p>
        </div>

        {/* Form */}

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="block font-semibold mb-2">Email</label>

            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold text-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}

        <div className="text-center mt-8">
          <p className="text-gray-500">Don't have an account?</p>

          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:text-blue-800"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
