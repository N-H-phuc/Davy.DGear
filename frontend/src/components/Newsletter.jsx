import { useState } from "react";

function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    alert("🎉 Thank you for subscribing!");

    setEmail("");
  };

  return (
    <section className="bg-blue-600 py-20 mt-20">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl font-bold text-white">Subscribe Newsletter</h2>

        <p className="text-blue-100 mt-4">
          Get the latest products, exclusive offers and flash sale updates.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-10 justify-center">
          <input
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-5 py-4 rounded-xl outline-none"
          />

          <button
            onClick={handleSubscribe}
            className="bg-black hover:bg-gray-900 text-white px-8 rounded-xl transition"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
