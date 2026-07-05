import { createContext, useContext, useState } from "react";

import { reviewApi } from "../api/reviewApi";

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState([]);

  // ==========================
  // LOAD REVIEW BY PRODUCT
  // ==========================

  const loadReviews = async (productId) => {
    try {
      const data = await reviewApi.getByProduct(productId);
      setReviews(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // ADD REVIEW
  // ==========================

  const addReview = async (review) => {
    try {
      await reviewApi.create(review);

      await loadReviews(review.product_id);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // UPDATE REVIEW
  // ==========================

  const updateReview = async (id, review, productId) => {
    try {
      await reviewApi.update(id, review);

      await loadReviews(productId);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // DELETE REVIEW
  // ==========================

  const removeReview = async (id, productId) => {
    try {
      await reviewApi.remove(id);

      await loadReviews(productId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,

        loadReviews,

        addReview,

        updateReview,

        removeReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  return useContext(ReviewContext);
}
