import { Link } from "react-router-dom";

function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold text-red-600">Payment Cancelled</h1>

      <p className="mt-5 text-gray-500">
        Your Stripe payment has been cancelled.
      </p>

      <Link
        to="/orders"
        className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl"
      >
        Back To Orders
      </Link>
    </div>
  );
}

export default PaymentCancelPage;
