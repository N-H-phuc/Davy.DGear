const Footer = ({ studentName, courseName }) => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid #ddd",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <p>© {year} ShopHub</p>
      <p>Student: {studentName}</p>
      <p>Course: {courseName}</p>
    </footer>
  );
};

export default Footer;
