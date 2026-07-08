import { FaFacebookF, FaInstagram, FaGithub, FaTwitter } from "react-icons/fa";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        {/* Shop Info */}

        <div>
          <h2 className="text-3xl font-bold text-white">ShopHub</h2>

          <p className="mt-5 leading-7">
            Your trusted online shopping destination. Discover quality products
            with the best prices and fast delivery.
          </p>
        </div>

        {/* Quick Links */}

        <div>
          <h3 className="text-xl font-semibold text-white mb-5">Quick Links</h3>

          <ul className="space-y-3">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/products" className="hover:text-white transition">
                Products
              </Link>
            </li>

            <li>
              <Link to="/wishlist" className="hover:text-white transition">
                Wishlist
              </Link>
            </li>

            <li>
              <Link to="/cart" className="hover:text-white transition">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer */}

        <div>
          <h3 className="text-xl font-semibold text-white mb-5">
            Customer Service
          </h3>

          <ul className="space-y-3">
            <li>Contact Us</li>

            <li>FAQs</li>

            <li>Shipping Policy</li>

            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Social */}

        <div>
          <h3 className="text-xl font-semibold text-white mb-5">Follow Us</h3>

          <div className="flex gap-4 text-2xl">
            <a href="#" className="hover:text-blue-500 transition">
              <FaFacebookF />
            </a>

            <a href="#" className="hover:text-pink-500 transition">
              <FaInstagram />
            </a>

            <a href="#" className="hover:text-sky-500 transition">
              <FaTwitter />
            </a>

            <a href="#" className="hover:text-white transition">
              <FaGithub />
            </a>
          </div>

          <div className="mt-8">
            <p>Email</p>

            <p className="text-white">support@shophub.com</p>

            <p className="mt-4">Phone</p>

            <p className="text-white">+84 123 456 789</p>
          </div>
        </div>
      </div>

      {/* Bottom */}

      <div className="border-t border-gray-700 py-6 text-center text-sm">
        © {new Date().getFullYear()} ShopHub. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
