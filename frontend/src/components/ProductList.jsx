import ProductCard from "./ProductCard";

const ProductList = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <h2 className="text-2xl font-bold text-gray-700">No products found</h2>

        <p className="text-gray-500 mt-3">
          Try searching with another keyword or category.
        </p>
      </div>
    );
  }

  return (
    <section className="py-4">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            flash_price={product.flash_price}
            is_flash_sale={product.is_flash_sale}
            flash_sale_percent={product.flash_sale_percent}
            sold={product.sold}
            stock={product.stock}
            category={product.category}
            imageUrl={product.imageUrl}
            description={product.description}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
