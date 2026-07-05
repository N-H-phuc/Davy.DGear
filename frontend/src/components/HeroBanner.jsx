import { useEffect, useState } from "react";

const banners = [
  {
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1600",
    title: "Latest Tech Collection",
    subtitle: "Discover premium laptops, phones and accessories.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600",
    title: "Summer Sale 2026",
    subtitle: "Save up to 50% on selected products.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600",
    title: "Build Your Dream Setup",
    subtitle: "Gaming PCs, monitors and accessories.",
  },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);

  const prev = () =>
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <section className="relative h-[520px] overflow-hidden">
      <img
        src={banners[current].image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative max-w-7xl mx-auto h-full flex items-center px-8">
        <div className="max-w-2xl text-white">
          <p className="uppercase tracking-[6px] text-blue-300 mb-4">ShopHub</p>

          <h1 className="text-6xl font-black leading-tight">
            {banners[current].title}
          </h1>

          <p className="mt-6 text-xl text-gray-200 leading-9">
            {banners[current].subtitle}
          </p>

          <div className="mt-10 flex gap-5">
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold">
              Shop Now
            </button>

            <button className="border border-white px-8 py-4 rounded-xl hover:bg-white hover:text-black transition">
              Explore
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur text-white w-12 h-12 rounded-full"
      >
        ❮
      </button>

      <button
        onClick={next}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur text-white w-12 h-12 rounded-full"
      >
        ❯
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;
