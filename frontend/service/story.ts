import type { Method } from "@/types/common";
import { Request } from "./common";

async function requests(path: string, { method, body }:{method: Method, body: unknown}) {
    return Request(`/story/${path}`, { method, body });
}

async function postJson(path: string, payload: unknown) {
  return requests(path, { method: "POST", body: payload });
}
async function getJson(path: string) {
  return requests(path, { method: "POST", body: null });
}

export async function GetStories(storyId: string) {
  return getJson(`:${storyId}`)
}

export async function GetStoryMedia(storyMediaId:string) {
    return getJson(`:${storyMediaId}`)
}