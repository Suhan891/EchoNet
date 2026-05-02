"use server";
import { cookies } from "next/headers";

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, {
    httpOnly: false,
    secure: false,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "lax",
    path: "/",
  });
}
export async function setProfileCookie(profileId: string) {
  const cookieStore = await cookies();
  cookieStore.set("profile", profileId, {
    httpOnly: false,
    secure: false,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "lax",
    path: "/",
  });
}
export async function deleteCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("profile");
}
export async function deleteProfileCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("profile");
}
