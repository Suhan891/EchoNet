
import { LikeRequest } from "@/types/like&comment";
import { Request } from "./common/requests";

async function postJson(path: string, payload: unknown) {
  return Request(`/like/${path}`, { method: 'POST', body: payload});
}
async function putJson(path: string, payload: unknown) {
  return Request(`/like/${path}`, { method: 'PUT', body: payload});
}
async function getJson(path: string) {
  return Request(`/like/${path}`, { method: 'GET', body: undefined});
}

export async function getProfiles(payload:LikeRequest) {
    return getJson(`view/${payload.id}?type=${payload.type}`)
}
export async function create(payload: LikeRequest) {
  return postJson(`add/${payload.id}?name=${payload.type}`,undefined)
}
export async function remove(id:string) {
  return putJson(`remove/${id}`, undefined)
}
