import { FollowDto } from "@/types/follow.type";
import { Request } from "./common/requests";

async function postJson(path: string, payload: unknown) {
  return Request(`/follow/${path}`, { method: 'POST', body: payload});
}
async function getJson(path: string) {
  return Request(`/follow/${path}`, { method: "GET", body: null });
}

export async function FollowRequest(profileId: string) {
    return postJson(`toggle/${profileId}`, undefined)
}
export async function GetFollow( payload: FollowDto) {
  return getJson(`${payload.id}?type=${payload.type}`)
}
