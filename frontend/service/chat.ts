import { messageType } from "@/validations/chats/message";
import { Request } from "./common/requests";

async function postJson(path: string, payload: unknown) {
  return Request(`/chat/${path}`, { method: 'POST', body: payload});
}
async function getJson(path: string) {
  return Request(`/chat/${path}`, { method: 'GET', body: undefined});
}
async function putJson(path: string, payload: unknown) {
  return Request(`/chat/${path}`, { method: "PUT", body: payload });
}
export async function getProfForPrivate() {
    return await getJson('private')
}
export async function getProfForGroup() {
    return await getJson('group')
}

export async function CreatePrivate(name: string) {
  return postJson(`private?profile=${name}`, undefined)
}
export async function CreateGroup(data:FormData) {
  return postJson(`group/create`, data)
}

export async function GetChats() {
  return getJson(``)
}

export async function UpdateApproval(chatId: string) {
  return putJson(`approve/${chatId}`, undefined)
}
export async function GetAllChatMsgs(chatId:string) {
  return getJson(`messages/${chatId}`)
}

export async function AddMessage(payload: messageType) {
  return postJson(`message/${payload.chatId}`,{format:  payload.format, content: payload.content})
}