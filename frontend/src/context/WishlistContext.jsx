import { createContext, useContext, useEffect, useState } from "react";

import { wishlistApi } from "../api/wishlistApi";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  const user = JSON.parse(localStorage.getItem("customerUser") || "null");

  const loadWishlist = async () => {
    try {
      const data = await wishlistApi.getAll();

      if (user) {
        setWishlistItems(data.filter((item) => item.user_id === user.id));
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const addWishlist = async (product) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const exists = wishlistItems.find(
        (item) => item.product.id === product.id
      );

      if (exists) {
        alert("Already in wishlist");
        return;
      }

      await wishlistApi.create({
        user_id: user.id,
        product_id: product.id,
      });

      loadWishlist();
    } catch (err) {
      console.log(err);
    }
  };

  const removeWishlist = async (id) => {
    try {
      await wishlistApi.remove(id);

      loadWishlist();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addWishlist,
        removeWishlist,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
