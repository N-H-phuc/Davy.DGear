import { useEffect, useState } from "react";

import { usersApi } from "../api/usersApi";

import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

function UserPage() {
  const [users, setUsers] = useState([]);

  const [editingUser, setEditingUser] = useState(null);

  // LOAD USERS
  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll();

      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // DELETE USER
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa user này?");

    if (!confirmDelete) return;

    try {
      await usersApi.remove(id);

      loadUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">User Management</h1>

          <p className="text-gray-500 mt-2">
            Manage all user accounts in the ShopHub system.
          </p>
        </div>

        <div className="mt-6 md:mt-0 bg-blue-600 text-white rounded-2xl px-6 py-4 shadow-lg">
          <p className="text-sm">Total Users</p>

          <h2 className="text-3xl font-bold">{users.length}</h2>
        </div>
      </div>

      {/* Form */}

      <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">
        <UserForm
          onSuccess={loadUsers}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
        />
      </div>

      {/* User List */}

      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User List</h2>

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
            {users.length} Users
          </span>
        </div>

        <UserList
          users={users}
          onEdit={setEditingUser}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
}

export default UserPage;
