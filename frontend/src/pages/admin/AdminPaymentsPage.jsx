import { useEffect, useState } from "react";
import { paymentsApi } from "../../api/paymentApi";

function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  const loadPayments = async () => {
    try {
      const data = await paymentsApi.getAll();

      setPayments(data);
      setFilteredPayments(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    let result = [...payments];

    // Search
    if (keyword) {
      result = result.filter(
        (payment) =>
          payment.transaction_code
            ?.toLowerCase()
            .includes(keyword.toLowerCase()) ||
          payment.order_id.toString().includes(keyword)
      );
    }

    // Filter
    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Sort
    if (sortOption === "Newest") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    if (sortOption === "Oldest") {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    setFilteredPayments(result);
  }, [payments, keyword, statusFilter, sortOption]);

  const totalRevenue = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const handleUpdateStatus = async (paymentId, status) => {
    try {
      await paymentsApi.updateStatus(paymentId, status);
      loadPayments();
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-8">
      <h1 className="text-4xl font-bold mb-8">Payment Management</h1>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-5">
          <input
            type="text"
            placeholder="Search Order / Transaction"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border rounded-xl p-3"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl p-3"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Paid</option>
            <option>Failed</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded-xl p-3"
          >
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-5 gap-5 mb-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">Total Payments</h3>

          <p className="text-4xl font-bold mt-3">{payments.length}</p>
        </div>

        <div className="bg-green-50 rounded-2xl shadow p-6">
          <h3 className="text-green-700">Paid</h3>

          <p className="text-4xl font-bold mt-3">
            {payments.filter((p) => p.status === "Paid").length}
          </p>
        </div>

        <div className="bg-yellow-50 rounded-2xl shadow p-6">
          <h3 className="text-yellow-700">Pending</h3>

          <p className="text-4xl font-bold mt-3">
            {payments.filter((p) => p.status === "Pending").length}
          </p>
        </div>

        <div className="bg-red-50 rounded-2xl shadow p-6">
          <h3 className="text-red-700">Failed</h3>

          <p className="text-4xl font-bold mt-3">
            {payments.filter((p) => p.status === "Failed").length}
          </p>
        </div>

        <div className="bg-blue-50 rounded-2xl shadow p-6">
          <h3 className="text-blue-700">Revenue</h3>

          <p className="text-4xl font-bold mt-3">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">ID</th>
              <th>Order</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Transaction</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{payment.id}</td>

                <td>#{payment.order_id}</td>

                <td>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    {payment.payment_method}
                  </span>
                </td>

                <td>${payment.amount.toLocaleString()}</td>

                <td>{payment.currency}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      payment.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : payment.status === "Failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>

                <td
                  className="max-w-xs truncate"
                  title={payment.transaction_code}
                >
                  {payment.transaction_code}
                </td>

                <td>{new Date(payment.created_at).toLocaleString("vi-VN")}</td>

                <td>
                  <select
                    value={payment.status}
                    onChange={(e) =>
                      handleUpdateStatus(payment.id, e.target.value)
                    }
                    className="border rounded-lg p-2"
                  >
                    <option value="Pending">Pending</option>

                    <option value="Paid">Paid</option>

                    <option value="Failed">Failed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPaymentsPage;
