import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { productsApi } from "../api/productsApi";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const data = await productsApi.getById(id);

      setProduct(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-2xl font-bold">Loading...</div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-2xl font-bold text-red-500">
        Product not found
      </div>
    );
  }

  const currentPrice = product.is_flash_sale
    ? product.flash_price
    : product.price;

  const soldPercent =
    product.stock > 0 ? Math.min((product.sold / product.stock) * 100, 100) : 0;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl p-10">
        {/* Product Image */}

        <div className="relative bg-gray-100 rounded-2xl flex items-center justify-center p-8">
          <img
            src={`http://127.0.0.1:8000${product.imageUrl}`}
            alt={product.name}
            className="max-h-[500px] object-contain hover:scale-105 transition duration-300"
          />

          {product.is_flash_sale && (
            <div className="absolute top-5 left-5 bg-red-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
              🔥 -{product.flash_sale_percent}%
            </div>
          )}
        </div>

        {/* Product Info */}

        <div className="flex flex-col">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold w-fit">
            {product.category}
          </span>

          <h1 className="text-4xl font-bold mt-5">{product.name}</h1>

          <div className="flex items-center gap-4 mt-5">
            <span className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</span>

            <span className="text-gray-500">(0 Reviews)</span>
          </div>

          {/* Price */}

          <div className="mt-8">
            {product.is_flash_sale ? (
              <>
                <p className="text-gray-400 line-through text-2xl">
                  ${Number(product.price).toLocaleString()}
                </p>

                <p className="text-red-600 text-5xl font-bold">
                  ${Number(product.flash_price).toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-5xl font-bold text-blue-600">
                ${Number(product.price).toLocaleString()}
              </p>
            )}
          </div>

          {/* Sold Progress */}

          {product.is_flash_sale && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Sold {product.sold}</span>

                <span>Stock {product.stock}</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full"
                  style={{
                    width: `${soldPercent}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Description */}

          <div className="mt-8">
            <h2 className="font-bold text-xl mb-3">Description</h2>

            <p className="text-gray-600 leading-8">{product.description}</p>
          </div>

          {/* Quantity */}

          <div className="mt-8">
            <label className="font-semibold">Quantity</label>

            <div className="mt-2">
              <input
                type="number"
                min="1"
                defaultValue={1}
                className="w-24 border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Buttons */}

          <div className="flex gap-4 mt-10">
            <button
              onClick={() =>
                addToCart({
                  ...product,
                  price: currentPrice,
                })
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition"
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={() =>
                addToCart({
                  ...product,
                  price: currentPrice,
                })
              }
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition"
            >
              Buy Now
            </button>
          </div>

          {/* Product Information */}

          <div className="mt-10 border-t pt-6 space-y-3">
            <p>
              <strong>Category:</strong> {product.category}
            </p>

            <p>
              <strong>Product ID:</strong> {product.id}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  product.stock > 0
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {product.stock > 0
                  ? `${product.stock} available`
                  : "Out of Stock"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Related Products</h2>

        <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-500">
          Related products will be implemented later.
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
