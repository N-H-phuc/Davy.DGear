import { useEffect, useState } from "react";
import { productsApi } from "../api/productsApi";
import { useNavigate } from "react-router-dom";
import FlashSaleCountdown from "./FlashSaleCountdown";

function FlashSaleSection() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState({});
  const navigate = useNavigate();
  // ==========================
  // LOAD FLASH SALE
  // ==========================

  const fetchFlashSale = async () => {
    try {
      const data = await productsApi.getFlashSale();

      setProducts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashSale();
  }, []);

  // ==========================
  // COUNTDOWN
  // ==========================

  useEffect(() => {
    const timer = setInterval(() => {
      const countdown = {};

      products.forEach((product) => {
        const end = new Date(product.flash_sale_end);

        const diff = end - new Date();

        if (diff <= 0) {
          countdown[product.id] = "Expired";
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));

          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

          const minutes = Math.floor((diff / (1000 * 60)) % 60);

          const seconds = Math.floor((diff / 1000) % 60);

          countdown[product.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
      });

      setTimeLeft(countdown);
    }, 1000);

    return () => clearInterval(timer);
  }, [products]);

  if (loading) {
    return <div className="text-center py-16">Loading Flash Sale...</div>;
  }

  if (products.length === 0) {
    return null;
  }
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold text-red-600">⚡ Flash Sale</h2>

          <p className="text-gray-500 mt-2">Limited time offers</p>
        </div>

        {products.length > 0 && (
          <FlashSaleCountdown endTime={products[0].flash_sale_end} />
        )}
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
        {products.map((product) => {
          const percent =
            product.stock > 0 ? (product.sold / product.stock) * 100 : 0;

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >
              {/* Image */}

              <div className="relative">
                <img
                  src={`http://127.0.0.1:8000${product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-60 object-contain bg-gray-50"
                />

                <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                  -{product.flash_sale_percent}%
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-xl">{product.name}</h3>

                <p className="text-gray-500 mt-2">{product.category}</p>

                {/* Price */}

                <div className="mt-5">
                  <span className="text-gray-400 line-through text-lg">
                    ${Number(product.price).toLocaleString()}
                  </span>

                  <div className="text-red-600 text-3xl font-bold">
                    ${Number(product.flash_price).toLocaleString()}
                  </div>
                </div>

                {/* Countdown */}

                <div className="mt-5 bg-red-50 rounded-xl p-3 text-center">
                  <div className="text-sm text-gray-500">Ends In</div>

                  <div className="font-bold text-red-600">
                    {timeLeft[product.id]}
                  </div>
                </div>

                {/* Sold */}

                <div className="mt-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sold</span>

                    <span>
                      {product.sold}/{product.stock}
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      style={{
                        width: `${percent}%`,
                      }}
                      className="bg-red-500 h-full rounded-full"
                    />
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FlashSaleSection;
