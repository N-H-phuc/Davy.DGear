import { Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext";

function OrdersPage() {
  const { orders, deleteOrder } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold">No Orders Yet</h1>

        <p className="text-gray-500 mt-4">You haven't placed any orders.</p>

        <Link
          to="/products"
          className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-10">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Order #{order.id}</h2>

                <p className="text-gray-500 mt-2">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-white font-semibold
                ${
                  order.status === "Pending"
                    ? "bg-yellow-500"
                    : order.status === "Shipping"
                    ? "bg-blue-500"
                    : order.status === "Completed"
                    ? "bg-green-600"
                    : "bg-red-500"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-2"
                >
                  <div>Product ID: {item.product_id}</div>

                  <div>Qty: {item.quantity}</div>

                  <div>${item.price.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <h2 className="text-2xl font-bold text-blue-600">
                Total ${order.total_price.toLocaleString()}
              </h2>

              <div className="flex gap-3">
                <Link
                  to={`/orders/${order.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  View
                </Link>

                <button
                  onClick={() => deleteOrder(order.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OrdersPage;
