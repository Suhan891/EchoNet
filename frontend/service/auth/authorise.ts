import { Request } from "../common/requests";

async function getJson(path: string) {
  return Request(path, { method: "GET", body: null });
}

// Fetching user details
export async function GetUser() {
  return getJson("/auth/me");
}
