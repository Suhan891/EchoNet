import { UpdateProfileType } from "@/validations/profile/update.profile";
import { Request } from "./common/requests";

async function postJson(path: string, payload: unknown) {
  return Request(`/profile/${path}`, { method: "POST", body: payload });
}
async function putJson(path: string, payload: unknown) {
  return Request(`/profile/${path}`, { method: "PUT", body: payload });
}
async function getJson(path: string) {
  return Request(`/profile/${path}`, { method: "GET", body: null });
}

export async function GetOwnprofile() {
  return getJson("own-details");
}

export async function UpdateProfile(data: UpdateProfileType) {
  return putJson("update", data);
}

export async function UpdateAvatar(payload: FormData) {
  return putJson("upavatar", payload);
}
export function CreateProfile(payload: FormData) {
  return postJson("create", payload);
}

export async function ToggleProfile(profileId: string) {
  return postJson(`activate/${profileId}`, undefined);
}

export async function GetAllProfiles() {
  return getJson("all");
}