import { Request } from "./common/requests";

async function getJson(path: string) {
  return Request(`/jobs/${path}`, { method: "GET", body: null });
}

export async function GetJobStatus(jobId: string) {
    return getJson(`${jobId}`)
}