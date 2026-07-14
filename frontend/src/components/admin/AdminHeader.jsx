import { useNavigate } from "react-router-dom";

function AdminHeader() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("adminUser"));

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/login");
  };

  return (
    <header className="h-20 bg-white shadow flex items-center justify-between px-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>

        <p className="text-gray-500">ShopHub Management System</p>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="font-semibold">{user?.full_name}</p>

          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>

        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
          {user?.full_name?.charAt(0).toUpperCase()}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
