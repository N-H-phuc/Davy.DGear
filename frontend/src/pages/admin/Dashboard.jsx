import { useEffect, useState } from "react";

import { dashboardApi } from "../../api/dashboardApi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalReviews: 0,
  });

  const [loading, setLoading] = useState(true);

  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [chartType, setChartType] = useState("month");
  const [orderStatus, setOrderStatus] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadRevenue = async (type) => {
    try {
      let data = [];

      switch (type) {
        case "day":
          data = await dashboardApi.getRevenueByDay();
          break;

        case "week":
          data = await dashboardApi.getRevenueByWeek();
          break;

        case "year":
          data = await dashboardApi.getRevenueByYear();
          break;

        default:
          data = await dashboardApi.getRevenueByMonth();
      }

      setRevenueData(data);
      setChartType(type);
    } catch (err) {
      console.log(err);
    }
  };

  const pieData = {
    labels: orderStatus.map((item) => item.status),

    datasets: [
      {
        data: orderStatus.map((item) => item.count),

        backgroundColor: ["#3b82f6", "#f59e0b", "#22c55e", "#ef4444"],
      },
    ],
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await dashboardApi.getStatistics();

      const topProductsData = await dashboardApi.getTopProducts();

      const customers = await dashboardApi.getTopCustomers();
      const status = await dashboardApi.getOrderStatus();

      setOrderStatus(status);

      setTopCustomers(customers);

      setTopProducts(topProductsData);

      // Mặc định hiển thị doanh thu theo tháng
      await loadRevenue("month");

      const totalRevenue = data.orders.reduce(
        (sum, order) => sum + (order.total_price || 0),
        0
      );

      setStats({
        totalUsers: data.users.length,

        totalProducts: data.products.total,

        totalOrders: data.orders.length,

        totalReviews: data.reviews.length,

        totalRevenue,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: revenueData.map((item) => {
      if (chartType === "day") return item.day;

      if (chartType === "week") return item.week;

      if (chartType === "year") return item.year;

      return item.month;
    }),

    datasets: [
      {
        label: "Revenue",

        data: revenueData.map((item) => item.revenue),

        borderColor: "#2563eb",

        backgroundColor: "rgba(37,99,235,.2)",

        borderWidth: 3,

        fill: true,

        tension: 0.35,
      },
    ],
  };

  const chartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const cards = [
    {
      title: "Users",
      value: stats.totalUsers,
      icon: "👤",
      color: "bg-blue-500",
    },
    {
      title: "Products",
      value: stats.totalProducts,
      icon: "📦",
      color: "bg-green-500",
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: "🛒",
      color: "bg-orange-500",
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: "💰",
      color: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="text-center text-xl py-20">Loading Dashboard...</div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>

        <p className="text-gray-500 mt-2">Welcome to ShopHub Admin Dashboard</p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center"
          >
            <div>
              <p className="text-gray-500">{card.title}</p>

              <h2 className="text-4xl font-bold mt-2">{card.value}</h2>
            </div>

            <div
              className={`${card.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center text-3xl`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">📈 Revenue Statistics</h2>

            <div className="flex gap-2">
              {["day", "week", "month", "year"].map((type) => (
                <button
                  key={type}
                  onClick={() => loadRevenue(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    chartType === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {revenueData.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No revenue data.</p>
          ) : (
            <div className="h-[420px]">
              <Line key={chartType} data={chartData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* Order Status */}

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">📊 Order Status</h2>

          <div className="h-[420px] flex items-center justify-center">
            <Pie key="order-status" data={pieData} />
          </div>
        </div>
      </div>

      {/* Top Products */}

      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">🔥 Top Selling Products</h2>

        {topProducts.length === 0 ? (
          <p className="text-gray-500">No sales data.</p>
        ) : (
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between border rounded-xl p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold w-10 text-blue-600">
                    {index + 1}
                  </div>

                  <img
                    src={`http://127.0.0.1:8000${product.image_path}`}
                    alt={product.name}
                    className="w-16 h-16 object-contain border rounded-lg"
                  />

                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>

                    <p className="text-gray-500">Product ID: {product.id}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Sold</p>

                  <p className="text-2xl font-bold text-blue-600">
                    {product.sold}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* top customers */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">👑 Top Customers</h2>

        {topCustomers.length === 0 ? (
          <p className="text-gray-500">No customer data.</p>
        ) : (
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div
                key={customer.user_id}
                className="flex justify-between items-center border rounded-xl p-4"
              >
                <div>
                  <h3 className="font-bold">
                    #{index + 1} {customer.full_name}
                  </h3>

                  <p className="text-gray-500">{customer.orders} Orders</p>
                </div>

                <div className="text-right">
                  <p className="text-gray-500">Total Spent</p>

                  <p className="text-2xl font-bold text-green-600">
                    ${customer.spent.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Management */}

      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Quick Management</h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition">
            👤 Users
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold transition">
            📦 Products
          </button>

          <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-semibold transition">
            📂 Categories
          </button>

          <button className="bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-semibold transition">
            🎟️ Vouchers
          </button>

          <button className="bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-xl font-semibold transition">
            ⭐ Reviews
          </button>

          <button className="bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-semibold transition">
            🛒 Orders
          </button>

          <button className="bg-indigo-500 hover:bg-fuchsia-500 transition">
            💳 Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
