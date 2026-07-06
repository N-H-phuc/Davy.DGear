import { useEffect, useState } from "react";
import { usersApi } from "../api/usersApi";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "../api/ordersApi";

function ProfilePage() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert("Confirm password does not match.");
      return;
    }

    try {
      await usersApi.changePassword(user.id, {
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });

      alert("Password updated successfully!");

      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.detail || "Update failed");
    }
  };

  const loadProfile = async () => {
    try {
      const data = await usersApi.getById(currentUser.id);

      setUser(data);

      setForm({
        full_name: data.full_name,
        email: data.email,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const res = await usersApi.update(user.id, form);

      setUser(res.user);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          full_name: res.user.full_name,
          email: res.user.email,
        })
      );

      setEditing(false);

      alert("Profile updated successfully!");
    } catch (err) {
      console.log(err);

      alert("Update failed");
    }
  };

  const [orders, setOrders] = useState([]);
  const loadOrders = async () => {
    try {
      const data = await ordersApi.getMyOrders();

      const myOrders = data.filter((o) => o.user_id === currentUser.id);

      setOrders(myOrders);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadProfile();
    loadOrders();
  }, []);

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold text-blue-600">Loading...</h2>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <div className="bg-white rounded-3xl shadow-xl p-10">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">
            {user.full_name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-bold">{user.full_name}</h1>

            <p className="text-gray-500">{user.role}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm text-gray-500">Full Name</h3>

            {editing ? (
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="mt-2 w-full border rounded-lg p-2"
              />
            ) : (
              <p className="text-xl font-semibold mt-2">{user.full_name}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm text-gray-500">Email</h3>

            {editing ? (
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full border rounded-lg p-2"
              />
            ) : (
              <p className="text-xl font-semibold mt-2">{user.email}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm text-gray-500">Role</h3>

            <p className="text-xl font-semibold mt-2">{user.role}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm text-gray-500">User ID</h3>

            <p className="text-xl font-semibold mt-2">#{user.id}</p>
          </div>
        </div>
        <div className="mt-10 flex gap-4">
          {!editing ? (
            <>
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setEditing(false);

                  setForm({
                    full_name: user.full_name,
                    email: user.email,
                  });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>
            </>
          )}
        </div>
        <div className="mt-12 bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Change Password</h2>

          <div className="space-y-5">
            <input
              type="password"
              name="old_password"
              placeholder="Current Password"
              value={passwordForm.old_password}
              onChange={handlePasswordChange}
              className="w-full border rounded-xl p-3"
            />

            <input
              type="password"
              name="new_password"
              placeholder="New Password"
              value={passwordForm.new_password}
              onChange={handlePasswordChange}
              className="w-full border rounded-xl p-3"
            />

            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={passwordForm.confirm_password}
              onChange={handlePasswordChange}
              className="w-full border rounded-xl p-3"
            />

            <button
              onClick={handleChangePassword}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Update Password
            </button>
          </div>
        </div>
        {/* My Orders */}

        <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            📦 My Orders
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              You haven't purchased anything yet.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">Order #{order.id}</h3>

                      <p className="text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full font-semibold ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-gray-700"
                      >
                        <span>Product #{item.product_id}</span>

                        <span>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <h3 className="text-xl font-bold text-red-600">
                      Total ${order.total_price}
                    </h3>

                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition"
                    >
                      View Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
