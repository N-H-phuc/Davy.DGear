import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productsApi } from "../api/productsApi";

function BestSellerProducts() {
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsApi.getBestSellers();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-4xl font-bold">🔥 Best Sellers</h2>

          <p className="text-gray-500 mt-2">Our most popular products.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
            >
              <img
                src={`http://127.0.0.1:8000${product.imageUrl}`}
                alt={product.name}
                className="w-full h-60 object-cover"
              />

              <div className="p-5">
                <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full">
                  🔥 Bestseller
                </span>

                <h3 className="font-bold text-xl mt-3">{product.name}</h3>

                <p className="text-gray-500 mt-2">Sold {product.sold}</p>

                <div className="flex justify-between items-center mt-5">
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price}
                  </span>

                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestSellerProducts;
