import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHistory } from "../../api/shipperApi";

function ShipperHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getHistory();
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📜 Lịch sử giao hàng</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Mã đơn</th>

              <th>Khách hàng</th>

              <th>Điện thoại</th>

              <th>Tổng tiền</th>

              <th>Trạng thái</th>

              <th>Ngày tạo</th>

              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-8">
                  Chưa có lịch sử giao hàng.
                </td>
              </tr>
            )}

            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t text-center hover:bg-gray-50"
              >
                <td className="p-4">#{order.id}</td>

                <td>{order.full_name}</td>

                <td>{order.phone}</td>

                <td>${order.total_price.toLocaleString()}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>{new Date(order.created_at).toLocaleDateString()}</td>

                <td>
                  <Link
                    to={`/shipper/orders/${order.id}`}
                    className="bg-blue-600 text-white px-3 py-2 rounded"
                  >
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShipperHistoryPage;
