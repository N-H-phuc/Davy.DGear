import PrimaryButton from "./PrimaryButton";

const Banner = ({ subtitle, buttonText }) => {
  return (
    <section
      style={{
        padding: "30px",
        backgroundColor: "#f2f2f2",
      }}
    >
      <h2>{subtitle}</h2>

      <p
        style={{
          color: "#666",
          fontSize: "18px",
        }}
      >
        Discover our latest products, best deals, and exclusive offers tailored
        just for you.
      </p>

      <PrimaryButton label={buttonText} />
    </section>
  );
};

export default Banner;
