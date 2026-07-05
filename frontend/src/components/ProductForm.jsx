// import { useEffect, useState } from "react";
// import axios from "axios";

// import { productsApi } from "../api/productsApi";
// import { categoriesApi } from "../api/categoriesApi";

// function ProductForm({ onSuccess, editingProduct, setEditingProduct }) {
//   const [categories, setCategories] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     category: "",
//     description: "",
//     imageUrl: "",

//     is_flash_sale: false,
//     flash_sale_percent: 0,

//     flash_sale_start: "",
//     flash_sale_end: "",

//     sold: 0,
//     stock: 0,
//   });

//   const [image, setImage] = useState(null);

//   // ==========================
//   // LOAD CATEGORIES
//   // ==========================

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const data = await categoriesApi.getAll();
//         setCategories(data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // ==========================
//   // EDIT PRODUCT
//   // ==========================

//   useEffect(() => {
//     if (editingProduct) {
//       setFormData({
//         name: editingProduct.name,
//         price: editingProduct.price,
//         category: editingProduct.category,
//         description: editingProduct.description,
//         imageUrl: editingProduct.imageUrl,

//         is_flash_sale: editingProduct.is_flash_sale,

//         flash_sale_percent: editingProduct.flash_sale_percent,

//         flash_sale_start: editingProduct.flash_sale_start
//           ? editingProduct.flash_sale_start.slice(0, 16)
//           : "",

//         flash_sale_end: editingProduct.flash_sale_end
//           ? editingProduct.flash_sale_end.slice(0, 16)
//           : "",

//         sold: editingProduct.sold,

//         stock: editingProduct.stock,
//       });
//     }
//   }, [editingProduct]);

//   // ==========================
//   // HANDLE CHANGE
//   // ==========================

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // ==========================
//   // HANDLE IMAGE
//   // ==========================

//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   // ==========================
//   // SUBMIT
//   // ==========================

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       let imageUrl = formData.imageUrl;

//       if (image) {
//         const uploadData = new FormData();

//         uploadData.append("image", image);

//         const response = await axios.post(
//           "http://127.0.0.1:8000/upload",
//           uploadData
//         );

//         imageUrl = response.data.imageUrl;
//       }

//       const product = {
//         name: formData.name.trim(),

//         price: Number(formData.price),

//         category: formData.category,

//         description: formData.description.trim(),

//         imageUrl,

//         is_flash_sale: formData.is_flash_sale,

//         flash_sale_percent: formData.is_flash_sale
//           ? Number(formData.flash_sale_percent)
//           : 0,

//         flash_sale_start: formData.is_flash_sale
//           ? formData.flash_sale_start || null
//           : null,

//         flash_sale_end: formData.is_flash_sale
//           ? formData.flash_sale_end || null
//           : null,

//         sold: Number(formData.sold),

//         stock: Number(formData.stock),
//       };

//       if (editingProduct) {
//         await productsApi.update(editingProduct.id, product);
//         setEditingProduct(null);
//       } else {
//         await productsApi.create(product);
//       }

//       onSuccess();

//       setFormData({
//         name: "",
//         price: "",
//         category: "",
//         description: "",
//         imageUrl: "",

//         is_flash_sale: false,
//         flash_sale_percent: 0,
//         flash_sale_start: "",
//         flash_sale_end: "",

//         sold: 0,
//         stock: 0,
//       });

//       setImage(null);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-8">
//       <h2 className="text-2xl font-bold mb-6">
//         {editingProduct ? "✏️ Edit Product" : "➕ Add Product"}
//       </h2>

//       <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
//         <div>
//           <label className="block font-medium mb-2">Product Name</label>

//           <input
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-lg px-4 py-3"
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-2">Price</label>

//           <input
//             type="number"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-lg px-4 py-3"
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-2">Category</label>

//           <select
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-lg px-4 py-3"
//           >
//             <option value="">-- Select Category --</option>

//             {categories.map((category) => (
//               <option key={category.id} value={category.name}>
//                 {category.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium mb-2">Product Image</label>

//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="w-full border rounded-lg px-3 py-2"
//           />
//         </div>
//         <div>
//           <label className="block font-medium mb-2">Discount (%)</label>

//           <input
//             type="number"
//             value={formData.flash_sale_percent}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 flash_sale_percent: Number(e.target.value),
//               })
//             }
//             className="w-full border rounded-lg px-4 py-3"
//           />
//         </div>
//         <div>
//           <label className="block font-medium mb-2">Flash Sale Start</label>

//           <input
//             type="datetime-local"
//             value={formData.flash_sale_start}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 flash_sale_start: e.target.value,
//               })
//             }
//             className="w-full border rounded-lg px-4 py-3"
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-2">Flash Sale End</label>

//           <input
//             type="datetime-local"
//             value={formData.flash_sale_end}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 flash_sale_end: e.target.value,
//               })
//             }
//             className="w-full border rounded-lg px-4 py-3"
//           />
//         </div>
//         <div>
//           <label className="block font-medium mb-2">Sold</label>

//           <input
//             type="number"
//             value={formData.sold}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 sold: Number(e.target.value),
//               })
//             }
//             className="w-full border rounded-lg px-4 py-3"
//           />
//         </div>
//         <div>
//           <label className="block font-medium mb-2">Stock</label>

//           <input
//             type="number"
//             value={formData.stock}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 stock: Number(e.target.value),
//               })
//             }
//             className="w-full border rounded-lg px-4 py-3"
//           />
//         </div>

//         <div className="md:col-span-2">
//           <label className="block font-medium mb-2">Description</label>

//           <textarea
//             rows="4"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-lg px-4 py-3"
//           />
//         </div>

//         <div className="md:col-span-2 flex gap-4 mt-4">
//           <button
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
//           >
//             {editingProduct ? "Update Product" : "Add Product"}
//           </button>

//           {editingProduct && (
//             <button
//               type="button"
//               onClick={() => {
//                 setEditingProduct(null);
//                 setImage(null);

//                 setFormData({
//                   name: "",
//                   price: "",
//                   category: "",
//                   description: "",
//                   imageUrl: "",

//                   is_flash_sale: false,
//                   flash_sale_percent: 0,
//                   flash_sale_start: "",
//                   flash_sale_end: "",

//                   sold: 0,
//                   stock: 0,
//                 });
//               }}
//               className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }

// export default ProductForm;

import { useEffect, useState } from "react";
import axios from "axios";

import { productsApi } from "../api/productsApi";
import { categoriesApi } from "../api/categoriesApi";

function ProductForm({ onSuccess, editingProduct, setEditingProduct }) {
  const [categories, setCategories] = useState([]);

  const initialForm = {
    name: "",
    price: "",
    category: "",
    description: "",
    imageUrl: "",

    is_flash_sale: false,
    flash_sale_percent: 0,
    flash_sale_start: "",
    flash_sale_end: "",

    sold: 0,
    stock: 0,
  };

  const [formData, setFormData] = useState(initialForm);

  const [image, setImage] = useState(null);

  // ==========================
  // LOAD CATEGORIES
  // ==========================

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

  // ==========================
  // EDIT PRODUCT
  // ==========================

  useEffect(() => {
    if (!editingProduct) return;

    setFormData({
      name: editingProduct.name,
      price: editingProduct.price,
      category: editingProduct.category,
      description: editingProduct.description,
      imageUrl: editingProduct.imageUrl,

      is_flash_sale: editingProduct.is_flash_sale,
      flash_sale_percent: editingProduct.flash_sale_percent || 0,

      flash_sale_start: editingProduct.flash_sale_start
        ? editingProduct.flash_sale_start.slice(0, 16)
        : "",

      flash_sale_end: editingProduct.flash_sale_end
        ? editingProduct.flash_sale_end.slice(0, 16)
        : "",

      sold: editingProduct.sold,
      stock: editingProduct.stock,
    });
  }, [editingProduct]);

  // ==========================
  // HANDLE CHANGE
  // ==========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================
  // HANDLE IMAGE
  // ==========================

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // ==========================
  // SUBMIT
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.imageUrl;

      if (image) {
        const uploadData = new FormData();

        uploadData.append("image", image);

        const response = await axios.post(
          "http://127.0.0.1:8000/upload",
          uploadData
        );

        imageUrl = response.data.imageUrl;
      }

      const product = {
        name: formData.name.trim(),
        price: Number(formData.price),
        category: formData.category,
        description: formData.description.trim(),
        imageUrl,

        is_flash_sale: formData.is_flash_sale,

        flash_sale_percent: formData.is_flash_sale
          ? Number(formData.flash_sale_percent)
          : 0,

        flash_sale_start: formData.is_flash_sale
          ? formData.flash_sale_start || null
          : null,

        flash_sale_end: formData.is_flash_sale
          ? formData.flash_sale_end || null
          : null,

        sold: Number(formData.sold),
        stock: Number(formData.stock),
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, product);

        setEditingProduct(null);
      } else {
        await productsApi.create(product);
      }

      onSuccess();

      setFormData(initialForm);
      setImage(null);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">
        {editingProduct ? "✏️ Edit Product" : "➕ Add Product"}
      </h2>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
        {/* Product Name */}

        <div>
          <label className="block font-medium mb-2">Product Name</label>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        {/* Price */}

        <div>
          <label className="block font-medium mb-2">Price ($)</label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        {/* Category */}

        <div>
          <label className="block font-medium mb-2">Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          >
            <option value="">-- Select Category --</option>

            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image */}

        <div>
          <label className="block font-medium mb-2">Product Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Flash Sale */}

        <div className="md:col-span-2 bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_flash_sale"
              checked={formData.is_flash_sale}
              onChange={handleChange}
              className="w-5 h-5"
            />

            <label className="font-bold text-red-600">Enable Flash Sale</label>
          </div>

          {formData.is_flash_sale && (
            <div className="grid md:grid-cols-3 gap-5 mt-6">
              <div>
                <label className="block font-medium mb-2">Discount (%)</label>

                <input
                  type="number"
                  name="flash_sale_percent"
                  value={formData.flash_sale_percent}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Start</label>

                <input
                  type="datetime-local"
                  name="flash_sale_start"
                  value={formData.flash_sale_start}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">End</label>

                <input
                  type="datetime-local"
                  name="flash_sale_end"
                  value={formData.flash_sale_end}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div className="md:col-span-3 bg-white rounded-xl p-4 border">
                <p className="text-gray-600">
                  Original Price:
                  <span className="font-bold ml-2">
                    ${Number(formData.price || 0).toLocaleString()}
                  </span>
                </p>

                <p className="text-red-600 font-bold text-xl mt-2">
                  Flash Price: $
                  {(
                    (Number(formData.price || 0) *
                      (100 - Number(formData.flash_sale_percent || 0))) /
                    100
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sold */}

        <div>
          <label className="block font-medium mb-2">Sold</label>

          <input
            type="number"
            name="sold"
            value={formData.sold}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        {/* Stock */}

        <div>
          <label className="block font-medium mb-2">Stock</label>

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        {/* Description */}

        <div className="md:col-span-2">
          <label className="block font-medium mb-2">Description</label>

          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        {/* Buttons */}

        <div className="md:col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>

          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setImage(null);
                setFormData(initialForm);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
