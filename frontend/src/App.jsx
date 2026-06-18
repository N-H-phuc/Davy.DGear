import Header from "./components/Header";
import Banner from "./components/Banner";
import FeatureSection from "./components/FeatureSection";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Header title="ShopHub" />

      <Banner subtitle="Welcome to ShopHub" buttonText="Shop Now" />

      <FeatureSection />

      <Footer
        studentName="Nguyen Hoang Phuc"
        courseName="Full-Stack Web Development"
      />
    </>
  );
};

export default App;
