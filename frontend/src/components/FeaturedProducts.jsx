import { useEffect, useState } from "react";
import { productsApi } from "../api/productsApi";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsApi.getAll(1, 8);

      setProducts(data.items);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold">Featured Products</h2>

            <p className="text-gray-500 mt-3">Discover our latest arrivals.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mt-14">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transition group"
            >
              <div className="overflow-hidden">
                <img
                  src={`http://127.0.0.1:8000${product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-60 object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-6">
                <span className="inline-block bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
                  {product.category}
                </span>

                <h3 className="text-xl font-bold mt-4">{product.name}</h3>

                <p className="text-gray-500 mt-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mt-6">
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price}
                  </span>

                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
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

export default FeaturedProducts;
