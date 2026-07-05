import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { voucherApi } from "../api/voucherApi";

function CheckoutPage() {
  const navigate = useNavigate();

  const { cartItems, totalPrice, clearCart } = useCart();

  const { createOrder } = useOrders();

  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    phone: "",
    address: "",
    payment_method: "COD",
  });

  const [voucherCode, setVoucherCode] = useState("");

  const [voucher, setVoucher] = useState(null);

  const [finalPrice, setFinalPrice] = useState(totalPrice);
  const flashSaleTotal = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.is_flash_sale
        ? Number(item.flash_price ?? item.price) * item.quantity
        : 0),
    0
  );

  const normalTotal = cartItems.reduce(
    (sum, item) =>
      sum + (!item.is_flash_sale ? Number(item.price) * item.quantity : 0),
    0
  );
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const applyVoucher = async () => {
    if (!voucherCode) {
      alert("Please enter voucher code");
      return;
    }

    try {
      const res = await voucherApi.apply({
        code: voucherCode,
        total_price: normalTotal,
      });

      setVoucher(res);

      setFinalPrice(res.final_price + flashSaleTotal);

      alert("Voucher applied successfully!");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.detail || "Invalid voucher");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const order = {
        user_id: user.id,

        full_name: form.full_name,

        phone: form.phone,

        address: form.address,

        payment_method: form.payment_method,

        total_price: finalPrice,

        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.flash_price ?? item.price,
        })),
      };

      await createOrder(order);

      clearCart();

      alert("Order placed successfully!");

      navigate("/orders");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.detail || "Checkout failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* FORM */}

        <div className="bg-white rounded-2xl shadow p-6 space-y-5">
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            rows={4}
            className="w-full border p-3 rounded-lg"
          />

          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="COD">Cash On Delivery</option>

            <option value="Banking">Banking</option>

            <option value="Momo">Momo</option>
          </select>
        </div>

        {/* ORDER SUMMARY */}

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-5">Order Summary</h2>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-3">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>

                  <p className="text-gray-500">x{item.quantity}</p>
                </div>

                <div className="font-bold">
                  $
                  {(
                    Number(item.flash_price ?? item.price) * item.quantity
                  ).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Voucher */}

          <div className="mt-6">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Voucher Code"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="flex-1 border p-3 rounded-lg"
              />

              <button
                onClick={applyVoucher}
                className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-lg"
              >
                Apply
              </button>
            </div>

            {voucher && (
              <div className="mt-4 bg-green-50 p-4 rounded-lg">
                <p>
                  Voucher:
                  <strong> {voucher.code}</strong>
                </p>

                <p>
                  Discount:
                  <strong> {voucher.discount_percent}%</strong>
                </p>

                <p>
                  Saved:
                  <strong> ${voucher.discount_amount.toLocaleString()}</strong>
                </p>
              </div>
            )}
          </div>

          <div className="border-t mt-6 pt-6 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>${totalPrice.toLocaleString()}</span>
            </div>

            {voucher && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>

                  <span>
                    -$
                    {voucher.discount_amount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-2xl font-bold">
                  <span>Final Total</span>

                  <span>${finalPrice.toLocaleString()}</span>
                </div>
              </>
            )}

            {!voucher && (
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>

                <span>${totalPrice.toLocaleString()}</span>
              </div>
            )}

            <button
              onClick={handleCheckout}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
