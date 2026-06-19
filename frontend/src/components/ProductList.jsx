// import { useEffect, useState } from "react";
// import ProductCard from "./ProductCard";

// const ProductList = ({ onSelectProduct }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetch("https://fakestoreapi.com/products")
//       .then((res) => res.json())
//       .then((data) => {
//         setProducts(data);
//         setLoading(false);
//       })
//       .catch(() => {
//         setError("Cannot load products");
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <h2>Loading products...</h2>;
//   }

//   if (error) {
//     return <h2>{error}</h2>;
//   }

//   return (
//     <section style={{ padding: "20px" }}>
//       <h2>Product Catalog</h2>

//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: "20px",
//         }}
//       >
//         {products.map((product) => (
//           <ProductCard
//             key={product.id}
//             title={product.title}
//             price={product.price}
//             category={product.category}
//             image={product.image}
//             onViewDetail={() => onSelectProduct(product.id)}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default ProductList;

import ProductCard from "./ProductCard";

const ProductList = ({ products, onSelectProduct }) => {
  if (products.length === 0) {
    return <h3>No products found</h3>;
  }

  return (
    <section style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.name}
            price={product.price}
            category={product.category}
            image={product.imageUrl}
            onViewDetail={() => onSelectProduct && onSelectProduct(product.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
