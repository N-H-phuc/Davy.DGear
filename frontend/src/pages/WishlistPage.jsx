import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

function WishlistPage() {
  const { wishlistItems, removeWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <section className="max-w-5xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold">❤️ Wishlist Empty</h1>

        <p className="text-gray-500 mt-4">
          You haven't added any products yet.
        </p>

        <Link
          to="/products"
          className="inline-block mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-10">❤️ My Wishlist</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <img
              src={`http://127.0.0.1:8000${item.product.imageUrl}`}
              alt={item.product.name}
              className="w-full h-64 object-contain bg-gray-100 p-6"
            />

            <div className="p-6">
              <h2 className="text-xl font-bold">{item.product.name}</h2>

              <p className="text-gray-500 mt-2">{item.product.category}</p>

              <p className="text-blue-600 text-2xl font-bold mt-5">
                ${Number(item.product.price).toLocaleString()}
              </p>

              <button
                onClick={() => removeWishlist(item.id)}
                className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WishlistPage;
