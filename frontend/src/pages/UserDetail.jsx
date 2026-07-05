import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { usersApi } from "../api/usersApi";

function UserDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const loadUser = async () => {
    try {
      const data = await usersApi.getById(id);

      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-2xl font-bold text-blue-600">Loading...</h2>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate("/users")}
        className="mb-8 text-blue-600 hover:text-blue-800 font-semibold"
      >
        ← Back to User List
      </button>

      <div className="bg-white rounded-3xl shadow-xl p-10">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">
            {user.full_name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {user.full_name}
            </h1>

            <p className="text-gray-500 mt-1">{user.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm text-gray-500">User ID</h3>

            <p className="text-xl font-semibold mt-2">{user.id}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm text-gray-500">Role</h3>

            <span
              className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
                user.role === "admin"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {user.role}
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 md:col-span-2">
            <h3 className="text-sm text-gray-500">Email Address</h3>

            <p className="text-lg mt-2">{user.email}</p>
          </div>
        </div>

        <div className="mt-10">
          <button
            onClick={() => navigate("/users")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Back to Users
          </button>
        </div>
      </div>
    </section>
  );
}

export default UserDetail;
