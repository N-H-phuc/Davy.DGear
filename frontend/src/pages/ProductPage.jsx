import { useEffect, useState } from "react";
import { productsApi } from "../api/productsApi";
import ProductList from "../components/ProductList";

function ProductPage() {
  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [sortOption, setSortOption] = useState("none");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // FETCH API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getAll();

        const mappedProducts = data.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          description: item.description,
          imageUrl: item.imageUrl,
        }));

        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
      } catch (err) {
        setError("Load product failed");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // SEARCH + FILTER + SORT

  useEffect(() => {
    let result = [...products];

    // search

    if (searchTerm.trim() !== "") {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // category

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // sort

    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortOption, products]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  if (loading) return <h3>Loading...</h3>;

  if (error) return <h3>{error}</h3>;

  return (
    <div>
      <h2>Product Catalog</h2>

      {/* FILTER BAR */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "20px 0",
        }}
      >
        <input
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="none">Sort none</option>

          <option value="price-asc">Price Low → High</option>

          <option value="price-desc">Price High → Low</option>
        </select>

        <button
          onClick={() => {
            setSearchTerm("");

            setSelectedCategory("All");

            setSortOption("none");
          }}
        >
          Clear Filters
        </button>
      </div>

      <p>
        Showing {filteredProducts.length}/{products.length}
        products
      </p>

      <ProductList
        products={filteredProducts}
        // onSelectProduct={onSelectProduct}
      />
    </div>
  );
}

export default ProductPage;
