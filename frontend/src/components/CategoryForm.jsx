import { useEffect, useState } from "react";
import { categoriesApi } from "../api/categoriesApi";

function CategoryForm({ onSuccess, editingCategory, setEditingCategory }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
    } else {
      setName("");
    }
  }, [editingCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Category name is required.");
      return;
    }

    try {
      const payload = {
        name,
      };

      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, payload);

        alert("Category updated successfully.");
      } else {
        await categoriesApi.create(payload);

        alert("Category created successfully.");
      }

      setName("");
      setEditingCategory(null);

      onSuccess();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {editingCategory ? "Edit Category" : "Add Category"}
        </h2>

        <p className="text-gray-500 mt-1">
          Create and manage product categories.
        </p>
      </div>

      <div>
        <label className="block mb-2 font-medium">Category Name</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name..."
          className="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          {editingCategory ? "Update Category" : "Create Category"}
        </button>

        {editingCategory && (
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setName("");
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
export default CategoryForm;
