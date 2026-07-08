import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { productsApi } from "../api/productsApi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { reviewApi } from "../api/reviewApi";
import { useReview } from "../context/ReviewContext";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import RelatedProducts from "../components/RelatedProducts";

function ProductDetailPage() {
  const { id } = useParams();

  const { addWishlist } = useWishlist();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);

  const [editingReview, setEditingReview] = useState(null);

  const { loadReviews } = useReview();

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const data = await productsApi.getById(id);

        setProduct(data);

        await loadReviews(Number(id));
      } catch (err) {
        console.log(err);

        setError("Could not load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await productsApi.getById(id);

      setProduct(data);
    } catch (err) {
      console.log(err);
      setError("Could not load product details.");
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      price: product.is_flash_sale ? product.flash_price : product.price,
      quantity,
    });

    alert("Added to cart successfully!");
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold text-blue-600">Loading product...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold text-red-600">{error}</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold">Product not found</h2>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <Link
        to="/products"
        className="text-blue-600 hover:text-blue-800 font-semibold"
      >
        ← Back to Products
      </Link>

      <div className="mt-8 bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-2">
        {/* IMAGE */}

        <div className="bg-gray-100 flex items-center justify-center p-10">
          <img
            src={`http://127.0.0.1:8000${product.imageUrl}`}
            alt={product.name}
            className="max-h-[500px] object-contain hover:scale-105 transition duration-300"
          />
        </div>

        {/* INFO */}

        <div className="p-10 flex flex-col">
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full w-fit font-semibold">
            {product.category}
          </span>

          <h1 className="text-4xl font-bold mt-5">{product.name}</h1>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</span>

            <span className="text-gray-500">(5.0 Reviews)</span>
          </div>

          <div className="mt-8">
            {product.is_flash_sale ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 line-through text-2xl">
                    ${Number(product.price).toLocaleString()}
                  </span>

                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.flash_sale_percent}%
                  </span>
                </div>

                <h2 className="text-5xl font-bold text-red-600 mt-2">
                  ${Number(product.flash_price).toLocaleString()}
                </h2>
              </>
            ) : (
              <h2 className="text-5xl font-bold text-blue-600">
                ${Number(product.price).toLocaleString()}
              </h2>
            )}
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-xl mb-3">Description</h3>

            <p className="text-gray-600 leading-8">{product.description}</p>
          </div>

          {/* Quantity */}

          <div className="mt-10">
            <h3 className="font-bold mb-3">Quantity</h3>

            <div className="flex items-center gap-3">
              <button
                onClick={decreaseQuantity}
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 text-xl font-bold"
              >
                -
              </button>

              <span className="text-xl font-bold w-12 text-center">
                {quantity}
              </span>

              <button
                onClick={increaseQuantity}
                className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}

          <div className="mt-10 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition"
            >
              🛒 Add To Cart
            </button>

            <button
              onClick={() => addWishlist(product)}
              className="px-8 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-semibold transition"
            >
              ❤️ Wishlist
            </button>
          </div>

          <button className="mt-5 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold transition">
            Buy Now
          </button>

          <div className="mt-10 border-t pt-6 space-y-3 text-gray-600">
            <p>🚚 Free shipping for orders over $100</p>

            <p>🔄 30-day return policy</p>

            <p>✔ 100% Genuine Product</p>

            <p>
              📦 Product ID:
              <span className="font-semibold ml-2">{product.id}</span>
            </p>
          </div>
        </div>
      </div>
      <RelatedProducts currentProduct={product} />

      <ReviewForm
        productId={Number(id)}
        editingReview={editingReview}
        setEditingReview={setEditingReview}
      />

      <ReviewList
        productId={Number(id)}
        editingReview={editingReview}
        setEditingReview={setEditingReview}
      />
      {/* <RelatedProducts currentProduct={product} /> */}
    </section>
  );
}

export default ProductDetailPage;
