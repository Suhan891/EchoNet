import { Request } from "./common/requests";

async function getJson(path: string) {
  return Request(`/jobs/${path}`, { method: "GET", body: null });
}
async function putJson(path: string, payload: unknown) {
  return Request(`/jobs/${path}`, { method: "PUT", body: payload });
}

export async function GetJobStatus(jobId: string) {
  return getJson(`${jobId}`);
}

export async function RetryJob(id: string) {
  return putJson(`${id}/retry`, undefined);
}

export async function CancelJob(id: string) {
  return putJson(`${id}/cancel`, undefined);
}