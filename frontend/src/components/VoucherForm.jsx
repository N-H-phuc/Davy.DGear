import { useEffect, useState } from "react";
import { voucherApi } from "../api/voucherApi";

function VoucherForm({ onSuccess, editingVoucher, setEditingVoucher }) {
  const [form, setForm] = useState({
    code: "",
    discount: "",
    quantity: "",
    is_active: true,
    expired_at: "",
  });

  useEffect(() => {
    if (editingVoucher) {
      setForm({
        code: editingVoucher.code,
        discount: editingVoucher.discount,
        quantity: editingVoucher.quantity,
        is_active: editingVoucher.is_active,
        expired_at: editingVoucher.expired_at
          ? editingVoucher.expired_at.slice(0, 16)
          : "",
      });
    }
  }, [editingVoucher]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setForm({
      code: "",
      discount: "",
      quantity: "",
      is_active: true,
      expired_at: "",
    });

    setEditingVoucher(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingVoucher) {
        await voucherApi.update(editingVoucher.id, form);
      } else {
        await voucherApi.create(form);
      }

      resetForm();

      onSuccess();
    } catch (err) {
      console.log(err);
      alert("Save voucher failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
      <input
        name="code"
        placeholder="Voucher Code"
        value={form.code}
        onChange={handleChange}
        className="border rounded-xl px-4 py-3"
        required
      />

      <input
        name="discount"
        type="number"
        placeholder="Discount (%)"
        value={form.discount}
        onChange={handleChange}
        className="border rounded-xl px-4 py-3"
        required
      />

      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={handleChange}
        className="border rounded-xl px-4 py-3"
        required
      />

      <input
        name="expired_at"
        type="datetime-local"
        value={form.expired_at}
        onChange={handleChange}
        className="border rounded-xl px-4 py-3"
      />

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
        />
        Active
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          {editingVoucher ? "Update Voucher" : "Create Voucher"}
        </button>

        {editingVoucher && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default VoucherForm;
