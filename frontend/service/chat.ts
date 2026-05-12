import { Request } from "./common/requests";

async function postJson(path: string, payload: unknown) {
  return Request(`/chat/${path}`, { method: 'POST', body: payload});
}
async function getJson(path: string) {
  return Request(`/chat/${path}`, { method: 'GET', body: undefined});
}

export async function getProfForPrivate() {
    return await getJson('private')
}
export async function getProfForGroup() {
    return await getJson('group')
}