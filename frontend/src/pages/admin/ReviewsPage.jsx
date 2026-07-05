import { useEffect, useState } from "react";

import { reviewApi } from "../../api/reviewApi";

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRating, setSelectedRating] = useState("All");

  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const data = await reviewApi.getAll();

      setReviews(data);
      setFilteredReviews(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    let result = [...reviews];

    if (searchTerm.trim() !== "") {
      result = result.filter(
        (review) =>
          review.user.full_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          review.product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRating !== "All") {
      result = result.filter(
        (review) => review.rating === Number(selectedRating)
      );
    }

    setFilteredReviews(result);
  }, [reviews, searchTerm, selectedRating]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }
  // ==========================
  // DELETE
  // ==========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    try {
      await reviewApi.remove(id);

      fetchReviews();
    } catch (err) {
      console.log(err);

      alert("Delete review failed.");
    }
  };
  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Review Management</h1>

          <p className="text-gray-500 mt-2">Manage customer reviews.</p>
        </div>

        <div className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">
          {reviews.length} Reviews
        </div>
      </div>
      {/* 👇 Thêm Search Box ở đây */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search customer or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="All">All Rating</option>
            <option value="5">★★★★★</option>
            <option value="4">★★★★☆</option>
            <option value="3">★★★☆☆</option>
            <option value="2">★★☆☆☆</option>
            <option value="1">★☆☆☆☆</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedRating("All");
            }}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
          >
            Clear
          </button>
        </div>
      </div>
      {/* 👇 Sau đó mới đến Review Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-8 py-6 border-b">
          <h2 className="text-2xl font-bold">Review List</h2>

          <p className="text-gray-500 mt-1">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-6 py-4">Image</th>

                <th className="px-6 py-4">Customer</th>

                <th className="px-6 py-4">Product</th>

                <th className="px-6 py-4">Rating</th>

                <th className="px-6 py-4">Comment</th>

                <th className="px-6 py-4">Date</th>

                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredReviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Image */}

                  <td className="px-6 py-4">
                    {review.imageUrl ? (
                      <img
                        src={`http://127.0.0.1:8000${review.imageUrl}`}
                        alt="Review"
                        onClick={() => setSelectedReview(review)}
                        className="w-20 h-20 object-cover rounded-xl border cursor-pointer hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl border flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>

                  {/* Customer */}

                  <td className="px-6 py-4 font-semibold">
                    {review.user.full_name}
                  </td>

                  {/* Product */}

                  <td className="px-6 py-4">{review.product.name}</td>

                  {/* Rating */}

                  <td className="px-6 py-4">
                    <span className="text-yellow-500 text-lg">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </td>

                  {/* Comment */}

                  <td className="px-6 py-4 max-w-xs">
                    <p
                      onClick={() => setSelectedReview(review)}
                      className="line-clamp-2 text-gray-600 cursor-pointer hover:text-blue-600"
                    >
                      {review.comment}
                    </p>
                  </td>

                  {/* Date */}

                  <td className="px-6 py-4">
                    {new Date(review.created_at).toLocaleDateString()}
                  </td>

                  {/* Action */}

                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {selectedReview && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setSelectedReview(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setSelectedReview(null)}
                className="absolute top-4 right-4 text-2xl hover:text-red-500"
              >
                ✕
              </button>

              <h2 className="text-3xl font-bold mb-8">Review Detail</h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Image */}
                <div>
                  {selectedReview.imageUrl ? (
                    <img
                      src={`http://127.0.0.1:8000${selectedReview.imageUrl}`}
                      alt="Review"
                      className="rounded-xl w-full border"
                    />
                  ) : (
                    <div className="h-80 border rounded-xl flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Information */}
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500">Customer</p>

                    <h3 className="text-xl font-bold">
                      {selectedReview.user.full_name}
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-500">Product</p>

                    <h3 className="font-semibold">
                      {selectedReview.product.name}
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-500">Rating</p>

                    <div className="text-yellow-500 text-2xl">
                      {"★".repeat(selectedReview.rating)}
                      {"☆".repeat(5 - selectedReview.rating)}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500">Comment</p>

                    <div className="bg-gray-100 rounded-xl p-4 leading-7">
                      {selectedReview.comment}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500">Created At</p>

                    <div>
                      {new Date(selectedReview.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewsPage;
