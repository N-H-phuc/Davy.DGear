const PrimaryButton = ({ label, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        bg-blue-600
        hover:bg-blue-700
        text-white
        font-semibold
        px-8
        py-3
        rounded-xl
        shadow-lg
        hover:shadow-xl
        active:scale-95
        transition-all
        duration-300
        ${className}
      `}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;
