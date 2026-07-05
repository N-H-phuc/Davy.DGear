import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { ordersApi } from "../api/ordersApi";

function OrderDetailPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await ordersApi.getById(id);

        setOrder(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-3xl font-bold">Loading...</div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center text-3xl font-bold">
        Order not found
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto py-10 px-6">
      <Link to="/orders" className="text-blue-600 font-semibold">
        ← Back to Orders
      </Link>

      <div className="bg-white rounded-3xl shadow-xl mt-8 p-8">
        <h1 className="text-4xl font-bold mb-8">Order #{order.id}</h1>

        {/* CUSTOMER */}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-bold text-xl mb-4">Customer Information</h2>

            <p>
              <strong>Name:</strong> {order.full_name}
            </p>

            <p>
              <strong>Phone:</strong> {order.phone}
            </p>

            <p>
              <strong>Address:</strong> {order.address}
            </p>

            <p>
              <strong>Payment:</strong> {order.payment_method}
            </p>
          </div>

          <div>
            <h2 className="font-bold text-xl mb-4">Order Information</h2>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <p>
              <strong>Created:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-6">
              Total: ${order.total_price.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* ITEMS */}

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Products</h2>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">Product ID</th>

                <th className="border p-3">Quantity</th>

                <th className="border p-3">Price</th>

                <th className="border p-3">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="border p-3 text-center">{item.product_id}</td>

                  <td className="border p-3 text-center">{item.quantity}</td>

                  <td className="border p-3 text-center">
                    ${item.price.toLocaleString()}
                  </td>

                  <td className="border p-3 text-center">
                    ${(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default OrderDetailPage;
