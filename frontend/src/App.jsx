// import { useState } from "react";

// import Header from "./components/Header";
// import Banner from "./components/Banner";
// import Footer from "./components/Footer";

// import ProductList from "./components/ProductList";
// import ProductDetail from "./components/ProductDetail";

// import UserList from "./components/UserList";
// import UserDetail from "./components/UserDetail";

// function App() {
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [selectedUserId, setSelectedUserId] = useState(null);

//   return (
//     <>
//       <Header title="ShopHub" />

//       <Banner subtitle="Welcome to our store" buttonText="Shop Now" />

//       <ProductList onSelectProduct={setSelectedProductId} />

//       <ProductDetail productId={selectedProductId} />

//       <UserList onSelectUser={setSelectedUserId} />

//       <UserDetail userId={selectedUserId} />

//       <Footer
//         studentName="Nguyen Hoang Phuc"
//         courseName="Full-Stack Web Development"
//       />
//     </>
//   );
// }

// export default App;

import { useState } from "react";

import Header from "./components/Header";
import Banner from "./components/Banner";
import Footer from "./components/Footer";

import ProductPage from "./pages/ProductPage";
import ProductDetail from "./components/ProductDetail";

import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";

function App() {
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <>
      <Header title="ShopHub" />

      <Banner subtitle="Welcome to our store" buttonText="Shop Now" />

      {/* Session 4 */}
      <ProductPage onSelectProduct={setSelectedProductId} />

      <ProductDetail productId={selectedProductId} />

      {/* User vẫn giữ lại */}
      <UserList onSelectUser={setSelectedUserId} />

      <UserDetail userId={selectedUserId} />

      <Footer
        studentName="Nguyen Hoang Phuc"
        courseName="Full-Stack Web Development"
      />
    </>
  );
}

export default App;
