import { Request } from "../common/requests";

async function getJson(path: string) {
  return Request(`/auth${path}`, { method: "GET", body: null });
}
async function putJson(path: string) {
  return Request(`/auth${path}`, { method: 'PUT', body: null });
}

// Fetching user details
export async function GetUser() {
  return getJson("/me");
}

export async function Logout() {
  return putJson('/logout')
}