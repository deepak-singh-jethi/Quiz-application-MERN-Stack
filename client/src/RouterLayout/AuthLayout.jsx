import React from "react";
import Auth from "../components/Auth";

const AuthLayout = () => {
  return <Auth></Auth>;
};

export default AuthLayout;

// export const action = async ({ request }) => {
//   // get current mode login/register
//   const searchParams = new URL(request.url).searchParams;
//   const mode = searchParams.get("mode") || "register";

//   if (mode !== "login" && mode !== "register") {
//     throw json({ message: "Invalid mode" });
//   }

//   // get the form data
//   let formData = await request.formData();

//   let data = {
//     email: formData.get("email"),
//     password: formData.get("password"),
//   };

//   if (mode === "register") {
//     data = {
//       ...data,
//       confirmPassword: formData.get("confirmPassword"),
//       name: formData.get("name"),
//     };
//   }

//   //
//   const response = await fetch("http://localhost:3000/api/v1/users/" + mode, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (response.status === 401 || response.status === 400) {
//     return response;
//   }
//   if (!response.ok) {
//     throw json({ message: "Something went wrong" });
//   }

//   const resData = await response.json();

//   localStorage.setItem("token", resData.data.token);
//   localStorage.setItem("role", resData.data.user.role);
//   localStorage.setItem("name", resData.data.user.name);
//   localStorage.setItem("email", resData.data.user.email);
//   localStorage.setItem("id", resData.data.user.id);

//   return redirect("/");
// };
