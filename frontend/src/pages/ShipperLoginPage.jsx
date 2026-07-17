import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/authApi";

function ShipperLoginPage() {
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

      if (res.user.role !== "shipper") {
        alert("This account is not a shipper.");

        return;
      }

      localStorage.setItem("shipperToken", res.access_token);

      localStorage.setItem("shipperUser", JSON.stringify(res.user));

      alert("Login successfully!");

      navigate("/shipper");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          🚚 Shipper Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl py-3"
          >
            {loading ? "Logging..." : "Login"}
          </button>
        </form>

        <Link to="/" className="block mt-6 text-center text-blue-600">
          Back Home
        </Link>
      </div>
    </section>
  );
}

export default ShipperLoginPage;
