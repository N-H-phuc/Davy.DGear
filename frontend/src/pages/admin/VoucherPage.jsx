import { useEffect, useState } from "react";

import { voucherApi } from "../../api/voucherApi";

import VoucherForm from "../../components/VoucherForm";

function VouchersPage() {
  const [vouchers, setVouchers] = useState([]);

  const [editingVoucher, setEditingVoucher] = useState(null);

  const [loading, setLoading] = useState(true);

  // ==========================
  // LOAD
  // ==========================

  const fetchVouchers = async () => {
    try {
      setLoading(true);

      const data = await voucherApi.getAll();

      setVouchers(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  // ==========================
  // EDIT
  // ==========================

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================
  // DELETE
  // ==========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this voucher?");

    if (!confirmDelete) return;

    try {
      await voucherApi.remove(id);

      fetchVouchers();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  // status
  const getVoucherStatus = (voucher) => {
    const now = new Date();

    if (!voucher.is_active) {
      return {
        text: "Inactive",
        color: "bg-gray-100 text-gray-700",
      };
    }

    if (voucher.quantity <= 0) {
      return {
        text: "Out of Stock",
        color: "bg-orange-100 text-orange-700",
      };
    }

    if (voucher.expired_at && new Date(voucher.expired_at) < now) {
      return {
        text: "Expired",
        color: "bg-red-100 text-red-700",
      };
    }

    return {
      text: "Active",
      color: "bg-green-100 text-green-700",
    };
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Voucher Management</h1>

          <p className="text-gray-500 mt-2">
            Create, update and delete vouchers.
          </p>
        </div>

        <div className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">
          {vouchers.length} Vouchers
        </div>
      </div>

      {/* Form */}

      <div className="bg-white rounded-2xl shadow-md p-8">
        <VoucherForm
          onSuccess={fetchVouchers}
          editingVoucher={editingVoucher}
          setEditingVoucher={setEditingVoucher}
        />
      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-8 py-6 border-b">
          <h2 className="text-2xl font-bold">Voucher List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Code</th>

                <th className="px-6 py-4 text-left">Discount</th>

                <th className="px-6 py-4 text-left">Quantity</th>

                <th className="px-6 py-4 text-left">Status</th>

                <th className="px-6 py-4 text-left">Created</th>

                <th className="px-6 py-4 text-left">Expired</th>

                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {vouchers.map((voucher) => (
                <tr key={voucher.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold">{voucher.code}</td>

                  <td className="px-6 py-4">{voucher.discount}%</td>

                  <td className="px-6 py-4">{voucher.quantity}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        getVoucherStatus(voucher).color
                      }`}
                    >
                      {getVoucherStatus(voucher).text}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(voucher.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {voucher.expired_at
                      ? new Date(voucher.expired_at).toLocaleString()
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(voucher)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(voucher.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {vouchers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    No vouchers found.
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

export default VouchersPage;
