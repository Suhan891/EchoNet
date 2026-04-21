"use server"
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, {
    httpOnly: false,
    secure: false,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "lax",
    path: "/",
  });
  console.log("Token: ", token);
  console.log("Cookie: ", cookieStore.get("accessToken"));
}
export async function setProfileId(profileId: string) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("accessToken");
  if (authToken) {
    const decoded = jwtDecode(authToken.value);
    const expiry = new Date(decoded.exp! * 1000); // to set the expiry time similar to token life sppan
    cookieStore.set("profile", profileId, {
      httpOnly: false,
      secure: false,
      expires: expiry,
      sameSite: "lax",
      path: "/",
    });
  }
}
export async function deleteCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("profile");
}
