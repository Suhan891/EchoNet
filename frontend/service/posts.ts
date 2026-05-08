import { PostReelDto } from "@/types/profiles";
import { Request } from "./common/requests";
import { PaginatedReqDto } from "@/types/common";

async function postJson(path: string, payload: unknown) {
  return Request(`/posts/${path}`, { method: 'POST', body: payload});
}
async function getJson(path: string) {
  return Request(`/posts/${path}`, { method: 'GET', body: undefined});
}

export async function CreatePost(data: FormData) {
    return postJson(`create`, data)
}
export async function GetOwnPosts() {
  return getJson(`own`)
}
export async function GetOthersPost(payload:PostReelDto) {
  return getJson(`others/${payload.profileId}`)
}
export async function GetAllPosts(payload:PaginatedReqDto) {
  if(payload.name) return getJson(`all?name=${payload.name}`)
  return getJson(`all?page=${payload.page}&limit=${payload.limit}`)
}

export async function UpdateSavePost(mediaId: string) {
  return postJson(`toggle/${mediaId}`, undefined)
}
export async function GetSavedPosts() {
  return getJson(`posts-saved`)
}
