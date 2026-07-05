import { useEffect, useState } from "react";
import { usersApi } from "../api/usersApi";

function UserForm({ onSuccess, editingUser, setEditingUser }) {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    role: "customer",
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        email: editingUser.email,
        full_name: editingUser.full_name,
        password: "",
        role: editingUser.role,
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        await usersApi.update(editingUser.id, {
          email: formData.email,
          full_name: formData.full_name,
          password: formData.password,
          role: formData.role,
        });

        setEditingUser(null);
      } else {
        await usersApi.create({
          email: formData.email,
          full_name: formData.full_name,
          password: formData.password,
        });
      }

      onSuccess();

      setFormData({
        email: "",
        full_name: "",
        password: "",
        role: "customer",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {editingUser ? "✏️ Edit User" : "➕ Add New User"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Email</label>

          <input
            name="email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Full Name
          </label>

          <input
            name="full_name"
            placeholder="Enter full name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Password
          </label>

          <input
            name="password"
            type="password"
            placeholder={
              editingUser ? "Leave blank if unchanged" : "Enter password"
            }
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Role</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {editingUser ? "Update User" : "Add User"}
          </button>

          {editingUser && (
            <button
              type="button"
              onClick={() => {
                setEditingUser(null);

                setFormData({
                  email: "",
                  full_name: "",
                  password: "",
                  role: "customer",
                });
              }}
              className="px-6 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default UserForm;
