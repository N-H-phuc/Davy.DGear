import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetail, uploadProof, verifyOTP } from "../../api/shipperApi";

function ShipperOrderDetailPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [file, setFile] = useState(null);

  const [otp, setOtp] = useState("");

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const res = await getOrderDetail(id);

      setOrder(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Chọn ảnh trước.");
      return;
    }

    try {
      await uploadProof(id, file);

      alert("Upload thành công.");

      loadOrder();
    } catch (err) {
      alert(err.response?.data?.detail || "Upload thất bại.");
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      alert("Nhập OTP.");
      return;
    }

    try {
      await verifyOTP(id, otp);

      alert("Xác nhận thành công.");

      loadOrder();
    } catch (err) {
      alert(err.response?.data?.detail || "OTP sai.");
    }
  };

  if (!order) return <div className="text-center mt-10">Đang tải...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Chi tiết đơn #{order.id}</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="font-semibold">Khách hàng</p>
            <p>{order.full_name}</p>
          </div>

          <div>
            <p className="font-semibold">Số điện thoại</p>
            <p>{order.phone}</p>
          </div>

          <div className="col-span-2">
            <p className="font-semibold">Địa chỉ</p>
            <p>{order.address}</p>
          </div>

          <div>
            <p className="font-semibold">Thanh toán</p>
            <p>{order.payment_method}</p>
          </div>

          <div>
            <p className="font-semibold">Trạng thái</p>
            <p>{order.status}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">Sản phẩm</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Product ID</th>

              <th>Số lượng</th>

              <th>Đơn giá</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">#{item.product_id}</td>

                <td className="text-center">{item.quantity}</td>

                <td className="text-center">
                  <td>${Number(item.price).toLocaleString("en-US")}</td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-5">
          <h2 className="text-2xl font-bold text-red-600">
            Tổng tiền: Tổng tiền: $
            {Number(order.total_price).toLocaleString("en-US")}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow mt-8 p-6">
        <h2 className="text-2xl font-bold mb-5">Upload ảnh giao hàng</h2>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button
          onClick={handleUpload}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>

        {order.proof_image && (
          <img
            src={`http://localhost:8000${order.proof_image}`}
            alt=""
            className="mt-5 w-72 rounded-lg border"
          />
        )}
      </div>

      <div className="bg-white rounded-xl shadow mt-8 p-6">
        <h2 className="text-2xl font-bold mb-5">Xác nhận OTP</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Nhập OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border rounded-lg p-3 w-64"
          />

          <button
            onClick={handleVerify}
            className="bg-green-600 text-white px-5 rounded-lg"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShipperOrderDetailPage;
