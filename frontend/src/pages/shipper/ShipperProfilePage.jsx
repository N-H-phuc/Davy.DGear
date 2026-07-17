import { useEffect, useState } from "react";
import {
  getProfile,
  getTodayIncome,
  getMonthIncome,
  getDashboard,
} from "../../api/shipperApi";

function ShipperProfilePage() {
  const [profile, setProfile] = useState(null);

  const [todayIncome, setTodayIncome] = useState(0);

  const [monthIncome, setMonthIncome] = useState(0);

  const [dashboard, setDashboard] = useState({
    delivered_orders: 0,
    failed_orders: 0,
    total_income: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, todayRes, monthRes, dashboardRes] = await Promise.all([
        getProfile(),
        getTodayIncome(),
        getMonthIncome(),
        getDashboard(),
      ]);

      setProfile(profileRes.data);
      setTodayIncome(todayRes.data.income);
      setMonthIncome(monthRes.data.income);
      setDashboard(dashboardRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!profile) {
    return <div className="text-center mt-10">Đang tải...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">👤 Hồ sơ Shipper</h1>

      {/* Profile */}

      <div className="bg-white rounded-2xl shadow p-8">
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-blue-600 text-white flex items-center justify-center text-5xl font-bold">
            {profile.full_name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-3xl font-bold">{profile.full_name}</h2>

            <p className="text-gray-500 mt-2">{profile.email}</p>

            <span className="inline-block mt-3 bg-green-100 text-green-700 px-4 py-2 rounded-full">
              {profile.role}
            </span>
          </div>
        </div>
      </div>

      {/* Income */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-green-50 rounded-xl shadow p-6">
          <p className="text-green-700">Thu nhập hôm nay</p>

          <h2 className="text-3xl font-bold mt-3">
            ${Number(todayIncome).toLocaleString("en-US")}
          </h2>
        </div>

        <div className="bg-blue-50 rounded-xl shadow p-6">
          <p className="text-blue-700">Thu nhập tháng này</p>

          <h2 className="text-3xl font-bold mt-3">
            ${Number(monthIncome).toLocaleString("en-US")}
          </h2>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-green-100 rounded-xl p-6 shadow">
          <h3 className="text-green-700">Đã giao</h3>

          <p className="text-4xl font-bold mt-3">
            {dashboard.delivered_orders}
          </p>
        </div>

        <div className="bg-red-100 rounded-xl p-6 shadow">
          <h3 className="text-red-700">Thất bại</h3>

          <p className="text-4xl font-bold mt-3">{dashboard.failed_orders}</p>
        </div>

        <div className="bg-purple-100 rounded-xl p-6 shadow">
          <h3 className="text-purple-700">Tổng thu nhập</h3>

          <p className="text-3xl font-bold mt-3">
            ${Number(dashboard.total_income).toLocaleString("en-US")}
          </p>
        </div>
      </div>

      {/* Account */}

      <div className="bg-white rounded-2xl shadow mt-8 p-8">
        <h2 className="text-2xl font-bold mb-6">Thông tin tài khoản</h2>

        <div className="space-y-4">
          <div className="flex justify-between border-b pb-3">
            <span>ID</span>
            <span>{profile.id}</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>Họ tên</span>
            <span>{profile.full_name}</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>Email</span>
            <span>{profile.email}</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>Vai trò</span>
            <span>{profile.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShipperProfilePage;
