import { useEffect, useState } from "react";

import { ordersApi } from "../../api/ordersApi";
import { shipperAdminApi } from "../../api/shipperAdminApi";
function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const [filteredOrders, setFilteredOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shippers, setShippers] = useState([]);
  const [assignShipper, setAssignShipper] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  // ==========================
  // GET ORDERS
  // ==========================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await ordersApi.getAll();

      setOrders(data);

      setFilteredOrders(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    loadShippers();
  }, []);

  // ==========================
  // FILTER
  // ==========================

  useEffect(() => {
    let result = [...orders];

    if (selectedStatus !== "All") {
      result = result.filter((order) => order.status === selectedStatus);
    }

    if (searchTerm.trim() !== "") {
      result = result.filter(
        (order) =>
          order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.phone.includes(searchTerm)
      );
    }

    setFilteredOrders(result);
  }, [orders, selectedStatus, searchTerm]);

  // ==========================
  // UPDATE STATUS
  // ==========================

  const handleStatusChange = async (id, status) => {
    try {
      await ordersApi.updateStatus(id, status);

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // DELETE
  // ==========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this order?");

    if (!confirmDelete) return;

    try {
      await ordersApi.delete(id);

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const loadShippers = async () => {
    try {
      const data = await shipperAdminApi.getAll();
      setShippers(data);
    } catch (err) {
      console.log(err);
    }
  };
  const assignOrder = async (orderId) => {
    const shipperId = assignShipper[orderId];

    if (!shipperId) {
      alert("Please select shipper");
      return;
    }

    try {
      await ordersApi.assignShipper(orderId, shipperId);

      alert("Assigned successfully");

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };
  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">Loading...</div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Orders Management</h1>

          <p className="text-gray-500 mt-2">Manage customer orders.</p>
        </div>

        <div className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">
          {orders.length} Orders
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500">Total Orders</p>

          <h2 className="text-3xl font-bold mt-2">{orders.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500">Pending</p>

          <h2 className="text-3xl font-bold text-yellow-500 mt-2">
            {orders.filter((o) => o.status === "Pending").length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500">Completed</p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {orders.filter((o) => o.status === "Completed").length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500">Cancelled</p>

          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {orders.filter((o) => o.status === "Cancelled").length}
          </h2>
        </div>
      </div>

      {/* Search + Filter */}

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="grid lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search customer or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="All">All Status</option>

            <option value="Pending">Pending</option>

            <option value="Processing">Processing</option>

            <option value="Completed">Completed</option>

            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedStatus("All");
            }}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
          >
            Clear Filter
          </button>
        </div>
      </div>

      {/* Orders Table */}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-8 py-6 border-b">
          <h2 className="text-2xl font-bold">Orders List</h2>

          <p className="text-gray-500 mt-1">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-6 py-4">Order ID</th>

                <th className="px-6 py-4">Customer</th>

                <th className="px-6 py-4">Phone</th>

                <th className="px-6 py-4">Total</th>

                <th className="px-6 py-4">Payment</th>

                <th className="px-6 py-4">Status</th>

                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Shipper</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">#{order.id}</td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{order.full_name}</p>

                      <p className="text-gray-500 text-sm">{order.address}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4">{order.phone}</td>

                  <td className="px-6 py-4 font-bold text-green-600">
                    ${Number(order.total_price).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">{order.payment_method}</td>

                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="border rounded-lg px-3 py-2"
                    >
                      <option value="Pending">Pending</option>

                      <option value="Processing">Processing</option>

                      <option value="Completed">Completed</option>

                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {order.shipper_name ? (
                      <span className="text-green-600 font-semibold">
                        {order.shipper_name}
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <select
                          className="border rounded px-2 py-1"
                          value={assignShipper[order.id] || ""}
                          onChange={(e) =>
                            setAssignShipper({
                              ...assignShipper,
                              [order.id]: e.target.value,
                            })
                          }
                        >
                          <option value="">Select</option>

                          {shippers.map((shipper) => (
                            <option key={shipper.id} value={shipper.id}>
                              {shipper.full_name}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => assignOrder(order.id)}
                          className="bg-blue-600 text-white px-3 rounded"
                        >
                          Assign
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          console.log(order);
                          setSelectedOrder(order);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDelete(order.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-16 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-2xl hover:text-red-500"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold mb-6">Order Detail</h2>

            <div className="grid grid-cols-2 gap-6">
              <hr className="my-8" />

              <h3 className="text-2xl font-bold mb-4">Products</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3">Product ID</th>

                      <th className="text-center px-4 py-3">Quantity</th>

                      <th className="text-right px-4 py-3">Price</th>

                      <th className="text-right px-4 py-3">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-3">#{item.product_id}</td>

                        <td className="text-center">{item.quantity}</td>

                        <td className="text-right">
                          ${Number(item.price).toLocaleString()}
                        </td>

                        <td className="text-right font-bold">
                          ${Number(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-8">
                <div className="text-right">
                  <p className="text-gray-500">Grand Total</p>

                  <h2 className="text-3xl font-bold text-green-600">
                    ${Number(selectedOrder.total_price).toLocaleString()}
                  </h2>
                </div>
              </div>
              <div>
                <p className="text-gray-500">Customer</p>
                <h3 className="font-bold text-xl">{selectedOrder.full_name}</h3>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>
                <h3 className="font-bold">{selectedOrder.phone}</h3>
              </div>

              <div>
                <p className="text-gray-500">Address</p>
                <h3 className="font-bold">{selectedOrder.address}</h3>
              </div>

              <div>
                <p className="text-gray-500">Payment</p>
                <h3 className="font-bold">{selectedOrder.payment_method}</h3>
              </div>

              <div>
                <p className="text-gray-500">Status</p>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {selectedOrder.status}
                </span>
              </div>

              <div>
                <p className="text-gray-500">Total</p>

                <h3 className="text-green-600 text-2xl font-bold">
                  ${Number(selectedOrder.total_price).toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
