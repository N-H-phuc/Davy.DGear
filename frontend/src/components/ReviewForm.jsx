import { useEffect, useState } from "react";
import axios from "axios";
import { useReview } from "../context/ReviewContext";

function ReviewForm({ productId, editingReview, setEditingReview }) {
  const { addReview, updateReview } = useReview();

  const user = JSON.parse(localStorage.getItem("user"));

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  const [image, setImage] = useState(null);

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);

      setComment(editingReview.comment);

      setImageUrl(editingReview.imageUrl);
    }
  }, [editingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      let uploadedImage = imageUrl;

      if (image) {
        const formData = new FormData();

        formData.append("image", image);

        const res = await axios.post("http://127.0.0.1:8000/upload", formData);

        uploadedImage = res.data.imageUrl;
      }

      const review = {
        user_id: user.id,
        product_id: productId,
        rating,
        comment,
        imageUrl: uploadedImage,
      };

      if (editingReview) {
        await updateReview(editingReview.id, review, productId);

        setEditingReview(null);
      } else {
        await addReview(review);
      }

      setRating(5);

      setComment("");

      setImage(null);

      setImageUrl("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6">
        {editingReview ? "Edit Review" : "Write a Review"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-semibold">Rating</label>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded-lg px-4 py-3 w-full"
          >
            <option value={5}>★★★★★</option>
            <option value={4}>★★★★☆</option>
            <option value={3}>★★★☆☆</option>
            <option value={2}>★★☆☆☆</option>
            <option value={1}>★☆☆☆☆</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Comment</label>

          <textarea
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Write your review..."
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Upload Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="flex gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
            type="submit"
          >
            {editingReview ? "Update Review" : "Submit Review"}
          </button>

          {editingReview && (
            <button
              type="button"
              onClick={() => {
                setEditingReview(null);

                setRating(5);

                setComment("");

                setImage(null);

                setImageUrl("");
              }}
              className="bg-gray-500 text-white px-8 py-3 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
