import PrimaryButton from "./PrimaryButton";

const Banner = ({ subtitle, buttonText }) => {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="max-w-2xl">
          <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🛍 Welcome to ShopHub
          </span>

          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            {subtitle}
          </h2>

          <p className="text-lg text-blue-100 leading-8 mb-8">
            Discover our latest products, unbeatable deals, and exclusive offers
            designed just for you. Shop with confidence and enjoy a seamless
            online shopping experience.
          </p>

          <PrimaryButton label={buttonText} />
        </div>
      </div>
    </section>
  );
};

export default Banner;
