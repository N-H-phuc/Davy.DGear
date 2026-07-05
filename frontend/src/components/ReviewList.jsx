
import { useState } from "react";
import { useReview } from "../context/ReviewContext";

function ReviewList({
  productId,
  editingReview,
  setEditingReview,
}) {
  const { reviews, removeReview } = useReview();

  const user = JSON.parse(localStorage.getItem("user"));

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 mt-10 text-center">
        <h2 className="text-2xl font-bold">
          No Reviews Yet
        </h2>

        <p className="text-gray-500 mt-3">
          Be the first person to review this product.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">
      <h2 className="text-3xl font-bold mb-8">
        Customer Reviews
      </h2>

      <div className="space-y-8">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-xl p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">
                  {review.user.full_name}
                </h3>

                <div className="text-yellow-500 text-xl mt-2">
                  {renderStars(review.rating)}
                </div>

                <p className="text-gray-500 text-sm mt-2">
                  {new Date(
                    review.created_at
                  ).toLocaleDateString()}
                </p>
              </div>

              {user?.id === review.user.id && (
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setEditingReview(review)
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      removeReview(
                        review.id,
                        productId
                      )
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <p className="mt-6 text-gray-700 leading-8">
              {review.comment}
            </p>

            {review.imageUrl && (
              <img
                src={`http://127.0.0.1:8000${review.imageUrl}`}
                alt="Review"
                className="mt-6 rounded-xl w-56 border"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewList;

