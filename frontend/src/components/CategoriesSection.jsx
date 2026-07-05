import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { categoriesApi } from "../api/categoriesApi";
const categoryIcons = {
  Laptop: "💻",
  Iphone: "📱",
  Watch: "⌚",
  Headphone: "🎧",
  Monitor: "🖥️",
  Keyboard: "⌨️",
  Mouse: "🖱️",
  Gaming: "🎮",
};

function CategoriesSection() {
  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/products?category=${category}`);
  };
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center">
        <h2 className="text-4xl font-bold">Browse Categories</h2>

        <p className="text-gray-500 mt-4">Explore products by category.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14">
        {categories.map((item) => (
          <div
            key={item.name}
            onClick={() => handleClick(item.name)}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:-translate-y-3 hover:shadow-2xl transition duration-300"
          >
            <div className="text-6xl text-center">
              {categoryIcons[item.name] || "📦"}
            </div>

            <h3 className="mt-6 text-center text-xl font-bold">{item.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;
