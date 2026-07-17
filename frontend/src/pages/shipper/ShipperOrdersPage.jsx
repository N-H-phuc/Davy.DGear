import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyOrders,
  pickupOrder,
  shippingOrder,
  failedOrder,
} from "../../api/shipperApi";

function ShipperOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const pickup = async (id) => {
    try {
      await pickupOrder(id);
      alert("Đã lấy hàng.");
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi");
    }
  };

  const shipping = async (id) => {
    try {
      await shippingOrder(id);
      alert("Đơn hàng đang được giao.");
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi");
    }
  };

  const failed = async (id) => {
    const reason = prompt("Nhập lý do giao thất bại:");

    if (!reason) return;

    try {
      await failedOrder(id, reason);
      alert("Đã cập nhật.");
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi");
    }
  };

  const badgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-100 text-gray-700";

      case "Confirmed":
        return "bg-purple-100 text-purple-700";

      case "WaitingPickup":
        return "bg-yellow-100 text-yellow-700";

      case "PickedUp":
        return "bg-indigo-100 text-indigo-700";

      case "Shipping":
        return "bg-blue-100 text-blue-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🚚 Đơn hàng của tôi</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="p-4">ID</th>
              <th>Khách hàng</th>
              <th>SĐT</th>
              <th>Địa chỉ</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Bạn chưa có đơn hàng nào.
                </td>
              </tr>
            )}

            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t text-center hover:bg-gray-50"
              >
                <td className="p-4 font-semibold">#{order.id}</td>

                <td>{order.full_name}</td>

                <td>{order.phone}</td>

                <td>{order.address}</td>

                <td>${order.total_price.toLocaleString()}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  <div className="flex justify-center gap-2 flex-wrap">
                    <Link
                      to={`/shipper/orders/${order.id}`}
                      className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded"
                    >
                      Chi tiết
                    </Link>

                    {order.status === "WaitingPickup" && (
                      <button
                        onClick={() => pickup(order.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded"
                      >
                        Lấy hàng
                      </button>
                    )}

                    {order.status === "PickedUp" && (
                      <button
                        onClick={() => shipping(order.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                      >
                        Bắt đầu giao
                      </button>
                    )}

                    {order.status === "Shipping" && (
                      <button
                        onClick={() => failed(order.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                      >
                        Báo thất bại
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShipperOrdersPage;
