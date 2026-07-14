import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { paymentsApi } from "../api/paymentApi";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const confirm = async () => {
      try {
        const orderId = searchParams.get("order_id");

        if (!orderId) return;

        await paymentsApi.confirmPayment(orderId);

        clearCart();

        alert("Stripe payment successful!");

        navigate("/orders");
      } catch (err) {
        console.log(err);
      }
    };

    confirm();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="text-5xl font-bold text-green-600">
        Processing Payment...
      </h1>
    </div>
  );
}

export default PaymentSuccessPage;
