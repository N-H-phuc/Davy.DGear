const Header = ({ title }) => {
  const navItems = ["Home", "Products", "Cart", "Login"];

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 24px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "60px" }}>{title}</h1>

      <nav>
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            style={{
              marginLeft: "15px",
              textDecoration: "none",
              color: "#4d73d4",
            }}
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;
