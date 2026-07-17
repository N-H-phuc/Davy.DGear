import { useEffect, useState } from "react";
import { getDashboard } from "../../api/shipperApi";

function ShipperDashboard() {
  const [dashboard, setDashboard] = useState({
    waiting_orders: 0,
    delivering_orders: 0,
    delivered_orders: 0,
    failed_orders: 0,
    total_income: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getDashboard();
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cards = [
    {
      title: "Đơn chờ lấy hàng",
      value: dashboard.waiting_orders,
      color: "bg-yellow-50 text-yellow-700",
      icon: "📦",
    },
    {
      title: "Đang giao",
      value: dashboard.delivering_orders,
      color: "bg-blue-50 text-blue-700",
      icon: "🚚",
    },
    {
      title: "Đã giao",
      value: dashboard.delivered_orders,
      color: "bg-green-50 text-green-700",
      icon: "✅",
    },
    {
      title: "Giao thất bại",
      value: dashboard.failed_orders,
      color: "bg-red-50 text-red-700",
      icon: "❌",
    },
    {
      title: "Thu nhập",
      value: `${dashboard.total_income.toLocaleString()} đ`,
      color: "bg-purple-50 text-purple-700",
      icon: "💰",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">🚚 Dashboard Shipper</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl shadow p-6 ${card.color}`}
          >
            <div className="text-5xl">{card.icon}</div>

            <p className="mt-4 text-lg font-medium">{card.title}</p>

            <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow mt-10 p-8">
        <h2 className="text-2xl font-bold mb-4">Xin chào Shipper 👋</h2>

        <div className="space-y-2 text-gray-600">
          <p>📦 Đơn chờ lấy hàng: WaitingPickup</p>
          <p>🚚 Đang giao: PickedUp + Shipping</p>
          <p>✅ Hoàn thành: Delivered</p>
          <p>❌ Thất bại: Failed</p>
        </div>
      </div>
    </div>
  );
}

export default ShipperDashboard;
