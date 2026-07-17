import { NavLink, Outlet, useNavigate } from "react-router-dom";

function ShipperLayout() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("shipperUser") || "null");

  const logout = () => {
    localStorage.removeItem("shipperToken");
    localStorage.removeItem("shipperUser");

    navigate("/shipper/login");
  };

  const menuClass = ({ isActive }) =>
    `block rounded-lg px-4 py-3 transition ${
      isActive ? "bg-white text-blue-700 font-semibold" : "hover:bg-blue-600"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-blue-700 text-white flex flex-col">
        <div className="p-6 border-b border-blue-500">
          <h2 className="text-3xl font-bold">🚚 ShopHub</h2>
          <p className="text-sm text-blue-200 mt-1">Shipper Panel</p>
        </div>

        <nav className="flex-1 p-5 space-y-2">
          <NavLink end to="/shipper" className={menuClass}>
            📊 Dashboard
          </NavLink>

          <NavLink to="/shipper/orders" className={menuClass}>
            🚚 Đơn của tôi
          </NavLink>

          <NavLink to="/shipper/history" className={menuClass}>
            📜 Lịch sử giao hàng
          </NavLink>

          <NavLink to="/shipper/profile" className={menuClass}>
            👤 Hồ sơ
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="border-t border-blue-500 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold text-lg">
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-semibold">{user?.full_name}</p>

              <p className="text-xs text-blue-200">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-5 w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg transition"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default ShipperLayout;
