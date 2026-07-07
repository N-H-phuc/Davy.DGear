import { useEffect, useState } from "react";

import { productsApi } from "../../api/productsApi";
import { categoriesApi } from "../../api/categoriesApi";

import ProductForm from "../../components/ProductForm";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  const [pageSize] = useState(8);

  const [totalPages, setTotalPages] = useState(1);

  const [totalItems, setTotalItems] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [keyword, setKeyword] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [sortOption, setSortOption] = useState("none");

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

      const data = await productsApi.getAll(
        page,
        pageSize,
        searchTerm,
        selectedCategory,
        sortOption
      );

      setProducts(data.items);
      setFilteredProducts(data.items);
      setTotalPages(data.total_pages);
      setTotalItems(data.total);
    } catch (err) {
      console.log(err);
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

  // useEffect(() => {
  //   fetchProducts();
  // }, [page, searchTerm, selectedCategory, sortOption]);
  useEffect(() => {
    fetchProducts(true);
  }, []);
  useEffect(() => {
    if (!loading) {
      fetchProducts();
    }
  }, [page, searchTerm, selectedCategory, sortOption]);
  useEffect(() => {
    fetchCategories();
  }, []);

  // Thêm Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(keyword);

      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);
  // ==========================
  // FILTER
  // ==========================

  // ==========================
  // EDIT
  // ==========================

  const handleEdit = (product) => {
    setEditingProduct(product);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // ==========================
  // DELETE
  // ==========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await productsApi.delete(id);

      fetchProducts();

      alert("Delete successfully.");
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed.");
    }
  };

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">Loading...</div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Product Management</h1>

          <p className="text-gray-500 mt-2">
            Create, edit and delete products.
          </p>
        </div>

        <div className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">
          {products.length} Products
        </div>
      </div>

      {/* Product Form */}

      <div className="bg-white rounded-2xl shadow-md p-8">
        <ProductForm
          onSuccess={fetchProducts}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
        />
      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="grid lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search product..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="border rounded-xl px-4 py-3"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setPage(1);
            }}
            className="border rounded-xl px-4 py-3"
          >
            <option value="none">Sort Price</option>

            <option value="price-asc">Low → High</option>

            <option value="price-desc">High → Low</option>
          </select>

          <button
            onClick={() => {
              setKeyword("");
              setSearchTerm("");
              setSelectedCategory("All");
              setSortOption("none");
              setPage(1);
            }}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
          >
            Clear
          </button>
        </div>
      </div>
      {/* Product Table */}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {loadingTable && (
          <div className="px-8 py-3 text-blue-600 font-medium">
            Loading products...
          </div>
        )}
        <div className="px-8 py-6 border-b">
          <h2 className="text-2xl font-bold">Product List</h2>

          <p className="text-gray-500 mt-1">
            Showing {filteredProducts.length} of {totalItems} products
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-6 py-4">Image</th>

                <th className="px-6 py-4">Product</th>

                <th className="px-6 py-4">Category</th>

                <th className="px-6 py-4">Price</th>

                <th className="px-6 py-4 text-center">Sold</th>

                <th className="px-6 py-4 text-center">Stock</th>

                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <img
                      src={`http://127.0.0.1:8000${product.imageUrl}`}
                      alt={product.name}
                      className="w-20 h-20 object-contain border rounded-xl"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <h3 className="font-bold">{product.name}</h3>

                    <p className="text-gray-500 text-sm">ID: {product.id}</p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {product.category}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-bold text-green-600">
                    ${Number(product.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-4 py-1 rounded-full font-semibold min-w-[60px] ${
                        product.sold > 20
                          ? "bg-green-100 text-green-700"
                          : product.stock > 10
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.sold}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-4 py-1 rounded-full font-semibold min-w-[60px] ${
                        product.stock > 20
                          ? "bg-green-100 text-green-700"
                          : product.stock > 10
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
    </div>
  );
}

export default ProductsPage;
