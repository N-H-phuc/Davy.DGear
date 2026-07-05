import { useEffect, useState } from "react";

import { categoriesApi } from "../../api/categoriesApi";
import CategoryForm from "../../components/CategoryForm";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [editingCategory, setEditingCategory] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // ======================
  // GET
  // ======================

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await categoriesApi.getAll();

      setCategories(data);

      setFilteredCategories(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ======================
  // SEARCH
  // ======================

  useEffect(() => {
    const result = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCategories(result);
  }, [searchTerm, categories]);

  // ======================
  // EDIT
  // ======================

  const handleEdit = (category) => {
    setEditingCategory(category);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ======================
  // DELETE
  // ======================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this category?");

    if (!confirmDelete) return;

    try {
      await categoriesApi.delete(id);

      fetchCategories();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Category Management</h1>

          <p className="text-gray-500 mt-2">
            Create, edit and delete categories.
          </p>
        </div>

        <div className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">
          {categories.length} Categories
        </div>
      </div>

      {/* Form */}

      <div className="bg-white rounded-2xl shadow-md p-8">
        <CategoryForm
          onSuccess={fetchCategories}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
        />
      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl shadow-md p-6">
        <input
          type="text"
          placeholder="Search category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-xl px-4 py-3 w-full"
        />
      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-8 py-6 border-b">
          <h2 className="text-2xl font-bold">Category List</h2>

          <p className="text-gray-500 mt-1">
            Showing {filteredCategories.length} of {categories.length}{" "}
            categories
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>

                <th className="px-6 py-4 text-left">Category</th>

                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-5">{category.id}</td>

                  <td className="px-6 py-5 font-semibold">{category.name}</td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(category.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-16 text-gray-500">
                    No category found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
