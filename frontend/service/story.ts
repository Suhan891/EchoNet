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

export async function CreateStoryRequest(payload: FormData) {
  return postJson('create', payload);
}
// To check if story is uploaded in background of backend => response from redis
export async function GetStory() {
  return getJson('status')
}
export async function StoriesOwnRequest() {
  return getJson('stories')
}

export async function GetStories(storyId: string) {
  return getJson(`:${storyId}`)
}

export async function GetStoryMedia(storyMediaId:string) {
    return getJson(`:${storyMediaId}`)
}