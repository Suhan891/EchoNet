import { Request } from "./common/requests";

async function getJson(path: string) {
  return Request(`/notification/${path}`, { method: "GET", body: null });
}
async function putJson(path: string, payload: unknown) {
  return Request(`/notification/${path}`, { method: "PUT", body: payload });
}
async function postJson(path: string, payload: unknown) {
  return Request(`/notification/${path}`, { method: 'POST', body: payload });
}

export async function GetNotifications() {
  return getJson(``)
}
export async function GetNotifyData(id: string) {
  return putJson(`${id}`, undefined)
}
export async function DeleteNotification(id: string) {
  return postJson(`remove/${id}`, undefined)
}