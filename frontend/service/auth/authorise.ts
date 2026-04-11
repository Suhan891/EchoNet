// import { Method } from "@/types/common";
// import { getToken, getUrl } from "../common";

// async function requests(path: string, method: Method) {
//   const url = getUrl(path);
//   const token = getToken();
//   if (!token) throw new Error("No token available" );
//   const headers = { 
//     "Content-Type": "application/json",
//     "Authorize": `Bearer ${token}`
//  };

//   const response = await fetch(url, {
//     method,
//     headers,
//   });
//   const result = await response.json();

//   if (!result.success) {
//     throw new Error(result);
//   }
//   return result;
// }

// // async function getJson(path: string) {
// //   return requests(path, "GET");
// // }

// // export async function GetUser() {
// //   return getJson("/auth/me");
// // }
