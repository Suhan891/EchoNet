import { Request } from "./common";

async function postJson(path: string, payload: unknown) {
  return Request(`/profile/${path}`, { method: "POST", body: payload });
}
async function getJson(path: string) {
  return Request(`/profile/${path}`, { method: "POST", body: null });
}

export async function GetOwnprofile() {
  return getJson('own-details')
}