import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Header({ title }) {
  const navigate = useNavigate();

  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

    window.location.reload();
  };

  const navItems = [
    {
      label: "Home",
      to: "/",
    },
    {
      label: "Products",
      to: "/products",
    },
    {
      label: `❤️ Wishlist (${wishlistItems.length})`,
      to: "/wishlist",
    },
    {
      label: `🛒 Cart (${cartItems.length})`,
      to: "/cart",
    },
  ];

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white shadow"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}

        <Link to="/" className="flex items-center gap-3">
          <span className="text-4xl">🛍️</span>

          <h1 className="text-3xl font-extrabold text-blue-600">{title}</h1>
        </Link>

        {/* Navigation */}

        <nav className="hidden lg:flex items-center gap-3">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}

          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>
              ⚙️ Admin
            </NavLink>
          )}
        </nav>

        {/* Right */}

        {!user ? (
          <div className="flex items-center gap-3">
            <NavLink
              to="/login"
              className="px-5 py-2 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 transition font-semibold"
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition font-semibold"
            >
              Register
            </NavLink>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* Avatar + Name */}

            <Link
              to={user.role === "admin" ? "/admin" : "/profile"}
              className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 transition"
            >
              <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow">
                {user.full_name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="font-bold text-gray-800">{user.full_name}</p>

                <p className="text-xs text-gray-500 uppercase">{user.role}</p>
              </div>
            </Link>

            {/* Customer Profile */}

            {user.role === "customer" && (
              <NavLink
                to="/profile"
                className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 transition font-semibold"
              >
                👤 Profile
              </NavLink>
            )}

            {/* Admin

            {user.role === "admin" && (
              <NavLink
                to="/admin"
                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
              >
                ⚙️ Dashboard
              </NavLink>
            )} */}

            {/* Logout */}

            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
