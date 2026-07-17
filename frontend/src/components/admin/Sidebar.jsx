import { NavLink } from "react-router-dom";

const menus = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: "📊",
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: "👤",
  },
  {
    title: "Shippers",
    path: "/admin/shippers",
    icon: "🚚",
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: "📦",
  },
  {
    title: "Categories",
    path: "/admin/categories",
    icon: "📂",
  },
  {
    title: "Vouchers",
    path: "/admin/vouchers",
    icon: "🎟️",
  },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: "🛒",
  },
  {
    title: "Payments",
    path: "/admin/payments",
    icon: "💳",
  },
  {
    title: "Reviews",
    path: "/admin/reviews",
    icon: "⭐",
  },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      <div className="text-3xl font-bold text-center py-8 border-b border-slate-700">
        ShopHub
      </div>

      <nav className="mt-6">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            end={menu.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 transition ${
                isActive ? "bg-blue-600" : "hover:bg-slate-800"
              }`
            }
          >
            <span>{menu.icon}</span>

            <span>{menu.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
