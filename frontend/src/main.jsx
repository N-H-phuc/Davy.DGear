import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import App from "./App.jsx";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ReviewProvider } from "./context/ReviewContext";
import { OrderProvider } from "./context/OrderContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <WishlistProvider>
        <ReviewProvider>
          <OrderProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </OrderProvider>
        </ReviewProvider>
      </WishlistProvider>
    </CartProvider>
  </React.StrictMode>
);
