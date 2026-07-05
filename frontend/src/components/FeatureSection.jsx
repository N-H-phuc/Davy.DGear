const FeatureSection = () => {
  const features = [
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Get your products delivered within 2–3 days.",
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      description: "All transactions are protected with modern encryption.",
    },
    {
      icon: "🏪",
      title: "Multiple Shops",
      description: "Browse products from different shops in one place.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-800">
            Why Choose ShopHub?
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            ShopHub provides a fast, secure, and convenient shopping experience
            with thousands of quality products from trusted sellers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >
              <div className="text-6xl mb-6">{feature.icon}</div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-7">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
