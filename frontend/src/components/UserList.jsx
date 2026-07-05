import { useNavigate } from "react-router-dom";

function UserList({ users = [], onEdit, onDelete }) {
  const navigate = useNavigate();

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center mt-8">
        <h2 className="text-2xl font-bold mb-3">User List</h2>

        <p className="text-gray-500">No users found.</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-6">👥 User List</h2>

      <div className="grid gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {user.full_name}
                </h3>

                <p className="text-gray-600 mt-1">📧 {user.email}</p>

                <p className="mt-2">
                  <span className="font-semibold">ID:</span> {user.id}
                </p>

                <p className="mt-1">
                  <span className="font-semibold">Role:</span>

                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onEdit(user)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => navigate(`/users/${user.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Detail
                </button>

                <button
                  onClick={() => onDelete(user.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
