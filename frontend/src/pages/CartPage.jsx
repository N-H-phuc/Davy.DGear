import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  } = useCart();
  console.log(cartItems);
  console.log(cartItems[0]);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  console.log(JSON.stringify(cartItems[0], null, 2));
  // ==========================
  // EMPTY CART
  // ==========================
  if (cartItems.length === 0) {
    return (
      <section className="max-w-5xl mx-auto py-16 px-6">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
          <div className="text-7xl mb-6">🛒</div>

          <h1 className="text-4xl font-bold text-gray-800">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mt-5">
            Add some amazing products to your shopping cart.
          </p>

          <Link
            to="/products"
            className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  // ==========================
  // CART
  // ==========================

  return (
    <section className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-10">Shopping Cart</h1>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex items-center gap-6"
          >
            {/* IMAGE */}
            {/* <img
              src={
                item.imageUrl
                  ? `http://127.0.0.1:8000${item.imageUrl}`
                  : item.image
              }
              alt={item.name || item.title}
              className="w-28 h-28 object-contain bg-gray-100 rounded-xl p-2"
            /> */}
            <img
              src={`http://127.0.0.1:8000${item.imageUrl}`}
              alt={item.name}
              className="w-28 h-28 object-contain bg-gray-100 rounded-xl p-2"
            />
            {/* INFO */}
            <div className="flex-1">
              {/* <h2 className="text-xl font-bold">{item.name || item.title}</h2>

              <p className="text-gray-500 mt-2">
                {typeof item.category === "object"
                  ? item.category?.name
                  : item.category}
              </p> */}
              <h2 className="text-xl font-bold">{item.name}</h2>

              <p className="text-gray-500 mt-2">{item.category}</p>

              <p className="text-blue-600 text-2xl font-bold mt-4">
                ${Number(item.price).toLocaleString()}
              </p>
            </div>

            {/* QUANTITY */}
            <div className="text-center">
              <p className="text-gray-500 mb-3">Quantity</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 text-xl font-bold"
                >
                  -
                </button>

                <span className="text-xl font-bold w-8 text-center">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* SUBTOTAL */}
            <div className="text-right">
              <p className="text-gray-500">Subtotal</p>

              <h2 className="text-2xl font-bold text-green-600 mt-2">
                ${(item.price * item.quantity).toLocaleString()}
              </h2>

              <button
                onClick={() => removeItem(item.id)}
                className="mt-5 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}

      <div className="bg-white rounded-3xl shadow-xl mt-10 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Order Summary</h2>

            <p className="text-gray-500 mt-2">
              Total Products: {cartItems.length}
            </p>
          </div>

          <div className="text-right">
            <p className="text-gray-500">Total Price</p>

            <h2 className="text-4xl font-bold text-blue-600">
              ${total.toLocaleString()}
            </h2>
          </div>
        </div>

        <div className="flex justify-between mt-10">
          <button
            onClick={clearCart}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Clear Cart
          </button>

          <Link
            to="/checkout"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-semibold transition"
          >
            Checkout
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CartPage;
