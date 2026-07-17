import { useEffect, useState } from "react";
import { shipperAdminApi } from "../../api/shipperAdminApi";

function AdminShippersPage() {
  const [shippers, setShippers] = useState([]);

  const [form, setForm] = useState({
    email: "",
    full_name: "",
    password: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadShippers();
  }, []);

  const loadShippers = async () => {
    try {
      const data = await shipperAdminApi.getAll();
      setShippers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await shipperAdminApi.update(editingId, form);
      } else {
        await shipperAdminApi.create(form);
      }

      setForm({
        email: "",
        full_name: "",
        password: "",
      });

      setEditingId(null);

      loadShippers();
    } catch (err) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  const edit = (shipper) => {
    setEditingId(shipper.id);

    setForm({
      email: shipper.email,
      full_name: shipper.full_name,
      password: "",
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this shipper?")) return;

    await shipperAdminApi.delete(id);

    loadShippers();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">🚚 Manage Shippers</h1>

      <form
        onSubmit={submit}
        className="bg-white shadow rounded-xl p-6 mb-10 space-y-4"
      >
        <input
          className="border p-3 rounded w-full"
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) =>
            setForm({
              ...form,
              full_name: e.target.value,
            })
          }
        />

        <input
          className="border p-3 rounded w-full"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          className="border p-3 rounded w-full"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded">
          {editingId ? "Update Shipper" : "Create Shipper"}
        </button>
      </form>

      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4">ID</th>
            <th>Name</th>
            <th>Email</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {shippers.map((shipper) => (
            <tr key={shipper.id} className="border-t text-center">
              <td className="p-4">{shipper.id}</td>

              <td>{shipper.full_name}</td>

              <td>{shipper.email}</td>

              <td className="space-x-2">
                <button
                  onClick={() => edit(shipper)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => remove(shipper.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminShippersPage;
