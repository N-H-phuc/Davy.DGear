import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({
  id,
  name,
  price,
  flash_price,
  is_flash_sale,
  flash_sale_percent,
  sold,
  stock,
  category,
  imageUrl,
  description,
}) => {
  const { addToCart } = useCart();

  const currentPrice = is_flash_sale ? flash_price : price;

  // const soldPercent = stock > 0 ? Math.min((sold / stock) * 100, 100) : 0;
  const total = sold + stock;

  const soldPercent = total > 0 ? (sold / total) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Product Image */}
      <div className="relative bg-gray-100 h-56 flex items-center justify-center">
        <img
          src={`http://127.0.0.1:8000${imageUrl}`}
          alt={name}
          className="max-h-48 object-contain hover:scale-110 transition duration-300"
        />

        {is_flash_sale && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-lg font-bold shadow">
            🔥 -{flash_sale_percent}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1">
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full w-fit">
          {category}
        </span>

        <h3 className="text-xl font-bold text-gray-800 mt-3 line-clamp-2">
          {name}
        </h3>

        <p className="text-gray-500 text-sm mt-3 flex-1">
          {description?.length > 80
            ? `${description.slice(0, 80)}...`
            : description}
        </p>

        {/* Price */}
        <div className="mt-5">
          {is_flash_sale ? (
            <>
              <p className="text-gray-400 line-through text-lg">
                ${Number(price).toLocaleString()}
              </p>

              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-red-600">
                  ${Number(flash_price).toLocaleString()}
                </span>

                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                  -{flash_sale_percent}%
                </span>
              </div>
            </>
          ) : (
            <span className="text-2xl font-bold text-blue-600">
              ${Number(price).toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="mt-3">
          <span className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</span>
        </div>

        {/* Sold Progress */}
        {/* {is_flash_sale && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Sold {sold}</span>
              <span>Stock {stock}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-orange-500 h-3 rounded-full"
                style={{
                  width: `${soldPercent}%`,
                }}
              ></div>
            </div>
          </div>
        )} */}

        {/* Sold & Stock */}

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-red-600 font-semibold">Sold: {sold}</span>

            <span className="text-green-600 font-semibold">Stock: {stock}</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full"
              style={{
                width: `${soldPercent}%`,
              }}
            ></div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {sold} sold • {stock} remaining
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Link
            to={`/products/${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-medium transition"
          >
            View
          </Link>

          <button
            onClick={() =>
              addToCart({
                id,
                name,
                price: currentPrice,
                category,
                imageUrl,
                description,
              })
            }
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition"
          >
            Add Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
