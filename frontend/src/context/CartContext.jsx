import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // ==========================
  // LOAD CART
  // ==========================

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ==========================
  // SAVE CART
  // ==========================

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ==========================
  // ADD TO CART
  // ==========================

  const addToCart = (product) => {
    const productId = product.id ?? product._id;

    const qty = Number(product.quantity) || 1;

    const existingItem = cartItems.find(
      (item) => (item.id ?? item._id) === productId
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          (item.id ?? item._id) === productId
            ? {
                ...item,
                quantity: item.quantity + qty,
              }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: qty,
        },
      ]);
    }
  };

  // ==========================
  // INCREASE QUANTITY
  // ==========================

  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        (item.id ?? item._id) === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // ==========================
  // DECREASE QUANTITY
  // ==========================

  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems
        .map((item) =>
          (item.id ?? item._id) === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ==========================
  // REMOVE ITEM
  // ==========================

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => (item.id ?? item._id) !== id));
  };

  // ==========================
  // CLEAR CART
  // ==========================

  const clearCart = () => {
    setCartItems([]);
  };

  // ==========================
  // TOTAL ITEMS
  // ==========================

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ==========================
  // TOTAL PRICE
  // ==========================

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.flash_price ?? item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
