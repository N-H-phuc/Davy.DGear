import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productsApi } from "../api/productsApi";
import { categoriesApi } from "../api/categoriesApi";

import ProductList from "../components/ProductList";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [categories, setCategories] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("none");

  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category");

  // ==========================
  // GET PRODUCTS
  // ==========================

  const fetchProducts = async (firstLoad = false) => {
    try {
      if (firstLoad) {
        setLoading(true);
      } else {
        setLoadingTable(true);
      }

      const category = categoryFromUrl || selectedCategory;

      const data = await productsApi.getAll(
        page,
        pageSize,
        searchTerm,
        category,
        sortOption
      );

      setProducts(data.items);
      setFilteredProducts(data.items);
      setTotalPages(data.total_pages);
      setTotalItems(data.total);
    } catch (err) {
      console.log(err);
      setError("Load products failed.");
    } finally {
      if (firstLoad) {
        setLoading(false);
      } else {
        setLoadingTable(false);
      }
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

  // Load categories

  useEffect(() => {
    fetchCategories();
  }, []);

  // Đọc category từ URL

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setPage(1);
    } else {
      setSelectedCategory("All");
    }
  }, [categoryFromUrl]);

  // Debounce search

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(keyword);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  // Load lần đầu

  useEffect(() => {
    fetchProducts(true);
  }, []);

  // Load lại khi filter thay đổi

  useEffect(() => {
    if (!loading) {
      fetchProducts();
    }
  }, [page, searchTerm, selectedCategory, sortOption, categoryFromUrl]);

  // Reset page

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, sortOption, categoryFromUrl]);
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
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
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
              setPage(1);
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
          {filteredProducts.length}
        </span>
        /{totalItems}
      </div>
      {loadingTable && (
        <div className="text-center py-3 text-blue-600 font-medium">
          Loading products...
        </div>
      )}
      <ProductList products={filteredProducts} />
      <div className="flex justify-center items-center gap-2 py-8">
        {/* Previous */}
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100"
        >
          ←
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setPage(index + 1)}
            className={`w-10 h-10 rounded-lg font-semibold transition ${
              page === index + 1
                ? "bg-blue-600 text-white"
                : "border hover:bg-gray-100"
            }`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next */}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default ProductPage;
