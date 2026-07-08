import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "../api/productsApi";

function RelatedProducts({ currentProduct }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (currentProduct) {
      fetchProducts();
    }
  }, [currentProduct]);

  const fetchProducts = async () => {
    try {
      const data = await productsApi.getAll();

      const list = data.items || data || [];

      const related = list
        .filter(
          (product) =>
            product.category === currentProduct.category &&
            product.id !== currentProduct.id
        )
        .slice(0, 4);

      setProducts(related);
    } catch (err) {
      console.log(err);
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>

      <div className="grid md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
          >
            <img
              src={`http://127.0.0.1:8000${product.imageUrl}`}
              alt={product.name}
              className="w-full h-56 object-cover"
            />

            <div className="p-5">
              <span className="text-sm text-blue-600">{product.category}</span>

              <h3 className="font-bold mt-2">{product.name}</h3>

              <p className="text-blue-600 text-xl font-bold mt-3">
                ${product.price}
              </p>

              <Link
                to={`/products/${product.id}`}
                className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
