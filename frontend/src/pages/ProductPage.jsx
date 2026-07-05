import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productsApi } from "../api/productsApi";
import { categoriesApi } from "../api/categoriesApi";

import ProductList from "../components/ProductList";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("none");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  // ==========================
  // GET PRODUCTS
  // ==========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await productsApi.getAll();

      const list = data.items || data || [];

      setProducts(list);
      setFilteredProducts(list);
    } catch (err) {
      setError("Load products failed.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // GET CATEGORIES
  // ==========================

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();

      setCategories([
        {
          id: 0,
          name: "All",
        },
        ...data,
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ==========================
  // FILTER
  // ==========================

  useEffect(() => {
    let result = [...products];

    if (searchTerm.trim() !== "") {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    const category = searchParams.get("category");

    if (category) {
      setSelectedCategory(category);
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, sortOption, searchParams]);

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">Loading...</div>
    );
  }

  // ==========================
  // ERROR
  // ==========================

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  // ==========================
  // UI
  // ==========================

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Products</h1>

          <p className="text-gray-500 mt-2">Manage your products easily.</p>
        </div>

        <div className="bg-blue-600 text-white px-5 py-2 rounded-lg">
          {filteredProducts.length} Products
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="🔍 Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-3"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-4 py-3"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded-lg px-4 py-3"
          >
            <option value="none">Sort Price</option>
            <option value="price-asc">Low → High</option>
            <option value="price-desc">High → Low</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setSortOption("none");
            }}
            className="bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mb-6 text-gray-600 font-medium">
        Showing
        <span className="font-bold text-blue-600">
          {" "}
          {filteredProducts.length}
        </span>
        /{products.length} products
      </div>

      <ProductList products={filteredProducts} />
    </div>
  );
}

export default ProductPage;
