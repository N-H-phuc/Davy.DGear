const PrimaryButton = ({ label }) => {
  return (
    <button
      style={{
        backgroundColor: "#4d73d4",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;
