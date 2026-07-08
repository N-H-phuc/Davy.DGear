import HeroBanner from "../components/HeroBanner";
import Footer from "../components/Footer";
import CategoriesSection from "../components/CategoriesSection";
import FeaturedProducts from "../components/FeaturedProducts";
import FlashSaleSection from "../components/FlashSaleSection";
import BestSellerProducts from "../components/BestSellerProducts";
import Newsletter from "../components/Newsletter";

function HomePage() {
  return (
    <>
      <HeroBanner subtitle="Welcome to our store" buttonText="Shop Now" />
      <CategoriesSection />
      <FeaturedProducts />
      <FlashSaleSection />
      <BestSellerProducts />
      <Newsletter />
      <Footer />
    </>
  );
}

export default HomePage;
