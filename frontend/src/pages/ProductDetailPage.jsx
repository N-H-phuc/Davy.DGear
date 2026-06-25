import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productsApi } from "../api/productsApi";

function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await productsApi.getById(id);

        setProduct({
          id: data.id,
          name: data.name,
          price: data.price,
          category: data.category,
          description: data.description,
          imageUrl: `http://127.0.0.1:8000${data.imageUrl}`,
        });
      } catch (err) {
        setError("Could not load product details from API.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <h2>Loading product...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <section style={{ padding: "24px" }}>
      <Link to="/products">← Back to Products</Link>

      <div
        style={{
          display: "flex",
          gap: "24px",
          marginTop: "20px",
        }}
      >
        <img src={product.imageUrl} alt={product.name} width="250" />

        <div>
          <h2>{product.name}</h2>

          <p>{product.category}</p>

          <h3>${product.price}</h3>

          <p>{product.description}</p>

          <button>Add To Cart</button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;
