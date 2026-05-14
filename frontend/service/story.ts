import type { Method } from "@/types/common";
import { Request } from "./common/requests";

async function requests(path: string, { method, body }:{method: Method, body: unknown}) {
    return Request(`/story/${path}`, { method, body });
}

async function postJson(path: string, payload: unknown) {
  return requests(path, { method: "POST", body: payload });
}
async function getJson(path: string) {
  return requests(path, { method: 'GET', body: null });
}
async function putJson(path: string, payload: unknown) {
  return requests(path, { method: "PUT", body: payload });
}

export async function CreateStoryRequest(payload: FormData) {
  return postJson('create', payload);
}
export async function RemoveStroy() {
  return putJson('remove', null)
}

// export async function StoriesOwnRequest() {
//   return getJson('own')
// }

export async function GetStory(storyId: string) {
  return getJson(`story/${storyId}`)
}

export async function GetStoryMedia(storyMediaId:string) {
    return getJson(`media/${storyMediaId}`)
}