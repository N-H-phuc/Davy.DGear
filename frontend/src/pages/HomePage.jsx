import HeroBanner from "../components/HeroBanner";
import Footer from "../components/Footer";
import CategoriesSection from "../components/CategoriesSection";
import FeaturedProducts from "../components/FeaturedProducts";
import FlashSaleSection from "../components/FlashSaleSection";

function HomePage() {
  return (
    <>
      <HeroBanner subtitle="Welcome to our store" buttonText="Shop Now" />
      <CategoriesSection />
      <FeaturedProducts />
      <FlashSaleSection />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">
            Welcome to ShopHub
          </h2>

          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the latest technology products with the best prices.
            ShopHub provides high-quality products, secure payments, and fast
            delivery to make your shopping experience simple and enjoyable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
            <div className="text-5xl mb-4">📱</div>

            <h3 className="text-xl font-semibold mb-3">Latest Products</h3>

            <p className="text-gray-600">
              Browse the newest smartphones, laptops, accessories and many other
              technology products.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
            <div className="text-5xl mb-4">🚚</div>

            <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>

            <p className="text-gray-600">
              We deliver your orders quickly with reliable shipping services and
              package tracking.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
            <div className="text-5xl mb-4">🛡️</div>

            <h3 className="text-xl font-semibold mb-3">Secure Shopping</h3>

            <p className="text-gray-600">
              Your personal information and payments are protected with secure
              authentication and trusted technologies.
            </p>
          </div>
        </div>

        <div className="mt-20 bg-blue-600 rounded-2xl text-white p-12 text-center">
          <h2 className="text-3xl font-bold">Start Shopping Today</h2>

          <p className="mt-4 text-blue-100">
            Explore hundreds of products and enjoy the best shopping experience
            with ShopHub.
          </p>

          <button className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Explore Products
          </button>
        </div>
      </section>

      <Footer
        studentName="Nguyen Hoang Phuc"
        courseName="Full-Stack Web Development"
      />
    </>
  );
}

export default HomePage;
