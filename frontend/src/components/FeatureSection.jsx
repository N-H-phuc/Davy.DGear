const FeatureSection = () => {
  const features = [
    {
      title: "Fast Delivery",
      description: "Get your products delivered within 2–3 days.",
    },
    {
      title: "Secure Payments",
      description: "All transactions are protected with modern encryption.",
    },
    {
      title: "Multiple Shops",
      description: "Browse products from different shops in one place.",
    },
  ];

  return (
    <section style={{ padding: "24px" }}>
      <h2 style={{ textAlign: "center" }}>Why ShopHub?</h2>

      {features.map((feature) => (
        <div
          key={feature.title}
          style={{
            border: "1px solid #e5e5e5",
            marginBottom: "18px",
            padding: "20px",
            textAlign: "center",
            borderRadius: "4px",
          }}
        >
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </section>
  );
};

export default FeatureSection;
