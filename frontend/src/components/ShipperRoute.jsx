import { Navigate } from "react-router-dom";

function ShipperRoute({ children }) {
  const token = localStorage.getItem("shipperToken");

  const user = JSON.parse(localStorage.getItem("shipperUser") || "null");

  if (!token || !user) {
    return <Navigate to="/shipper/login" replace />;
  }

  if (user.role !== "shipper") {
    return <Navigate to="/shipper/login" replace />;
  }

  return children;
}

export default ShipperRoute;
