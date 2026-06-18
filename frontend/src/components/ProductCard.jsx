// const ProductCard = ({ title, price, category, image, onViewDetail }) => {
//   return (
//     <div
//       style={{
//         border: "1px solid #ddd",
//         borderRadius: "8px",
//         padding: "12px",
//         width: "220px",
//       }}
//     >
//       <img
//         src={image}
//         alt={title}
//         style={{
//           width: "100%",
//           height: "150px",
//           objectFit: "contain",
//         }}
//       />

//       <h3>{title}</h3>

//       <p>{category}</p>

//       <p>
//         <strong>${price}</strong>
//       </p>

//       <button onClick={onViewDetail}>View Details</button>
//     </div>
//   );
// };

// export default ProductCard;

const ProductCard = ({ title, price, category, image, onViewDetail }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        width: "220px",
        // --- CHÌA KHÓA Ở ĐÂY ---
        display: "flex",
        flexDirection: "column",
        height:
          "100%" /* Đảm bảo card chiếm hết chiều cao hàng nếu nằm trong Grid/Flex cha */,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          height: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Cố định chiều cao tiêu đề tối đa 2 dòng để không bị đẩy lệch */}
      <h3
        style={{
          fontSize: "16px",
          margin: "12px 0 4px 0",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          height: "42px" /* Giữ khoảng trống bằng 2 dòng chữ */,
          lineHeight: "21px",
        }}
      >
        {title}
      </h3>

      <p style={{ color: "#666", fontSize: "14px", margin: "4px 0" }}>
        {category}
      </p>

      <p style={{ margin: "4px 0 16px 0", fontSize: "16px" }}>
        <strong>${price}</strong>
      </p>

      {/* --- ĐẨY NÚT XUỐNG ĐÁY CARD --- */}

      <button
        onClick={onViewDetail}
        style={{
          marginTop:
            "auto" /* Tự động ăn hết khoảng trống còn lại để xuống dưới cùng */,
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        View Details
      </button>
    </div>
  );
};

export default ProductCard;
