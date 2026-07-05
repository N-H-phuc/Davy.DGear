// import { useEffect, useState } from "react";
// import { usersApi } from "../api/usersApi";

// const UserDetail = ({ userId }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     if (!userId) return;

//     const fetchUser = async () => {
//       try {
//         const data = await usersApi.getById(userId);
//         setUser(data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchUser();
//   }, [userId]);

//   if (!userId) {
//     return (
//       <h2 className="text-center text-gray-500 py-10">
//         Select a user
//       </h2>
//     );
//   }

//   if (!user) {
//     return (
//       <h2 className="text-center text-blue-600 py-10">
//         Loading user...
//       </h2>
//     );
//   }

//   return (
//     <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-8">

//       <div className="flex items-center gap-5 mb-8">

//         <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
//           {user.full_name.charAt(0).toUpperCase()}
//         </div>

//         <div>
//           <h2 className="text-2xl font-bold">
//             {user.full_name}
//           </h2>

//           <p className="text-gray-500 uppercase">
//             {user.role}
//           </p>
//         </div>

//       </div>

//       <div className="space-y-4">

//         <p>
//           <strong>ID:</strong> {user.id}
//         </p>

//         <p>
//           <strong>Email:</strong> {user.email}
//         </p>

//         <p>
//           <strong>Role:</strong> {user.role}
//         </p>

//       </div>

//     </div>
//   );
// };

// export default UserDetail;
