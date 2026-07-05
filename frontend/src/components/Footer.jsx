const Footer = ({ studentName, courseName }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          {/* ShopHub */}

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">🛍 ShopHub</h2>

            <p className="leading-7 text-gray-400">
              ShopHub is a modern e-commerce platform where customers can
              discover quality products, enjoy secure payments, and experience
              fast delivery.
            </p>
          </div>

          {/* Student */}

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Student Information
            </h3>

            <p>
              <span className="font-semibold">Name:</span> {studentName}
            </p>

            <p className="mt-2">
              <span className="font-semibold">Course:</span> {courseName}
            </p>
          </div>

          {/* Contact */}

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>

            <p>Email: support@shophub.com</p>

            <p className="mt-2">Phone: +84 123 456 789</p>

            <p className="mt-2">Ho Chi Minh City, Vietnam</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500">
          © {year} <span className="font-semibold text-white">ShopHub</span>.
          All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
