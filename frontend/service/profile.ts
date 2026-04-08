import { requestUrl } from "./common";


async function profileUrl(path: string) {
    return `${requestUrl()}/profile${path}`
}

async function getJson(path: string) {
  return requests(path, "GET");
}v