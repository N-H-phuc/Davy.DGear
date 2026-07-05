import { useEffect, useState } from "react";
import { usersApi } from "../../api/usersApi";

function UsersPage() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "user",
  });

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await usersApi.getAll();

      setUsers(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      full_name: "",
      email: "",
      password: "",
      role: "user",
    });

    setEditingUser(null);
  };

  const handleAdd = () => {
    resetForm();

    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);

    setForm({
      full_name: user.full_name,
      email: user.email,
      password: "",
      role: user.role,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this user?");

    if (!ok) return;

    try {
      await usersApi.remove(id);

      loadUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        const updateData = {
          full_name: form.full_name,
          email: form.email,
          role: form.role,
        };

        if (form.password.trim() !== "") {
          updateData.password = form.password;
        }

        await usersApi.update(editingUser.id, updateData);

        alert("User updated successfully!");
      } else {
        await usersApi.create(form);

        alert("User created successfully!");
      }

      setShowModal(false);

      resetForm();

      loadUsers();
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.detail || "Operation failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>

        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          + Add User
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">
              {editingUser ? "Edit User" : "Add User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={
                  editingUser
                    ? "Leave blank to keep current password"
                    : "Password"
                }
                className="w-full border p-3 rounded-lg"
                required={!editingUser}
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              >
                <option value="user">User</option>

                <option value="admin">Admin</option>
              </select>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-5 py-3 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
                >
                  {editingUser ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">ID</th>
                <th className="border p-3">Full Name</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Role</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border p-3 text-center">{user.id}</td>

                  <td className="border p-3">{user.full_name}</td>

                  <td className="border p-3">{user.email}</td>

                  <td className="border p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        user.role === "admin" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="border p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
