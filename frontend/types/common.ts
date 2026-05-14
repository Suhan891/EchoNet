export type Method = "GET" | "POST" | "PUT" | "DELETE";
export interface RequestDto {
  method: Method;
  body: unknown | FormData;
}
export interface SuccessResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp?: string;
}
export interface ErrorResponse {
  success: boolean;
  error: unknown;
  message: string;
}

export interface JobCreate {
  id: string;
  name: "STORY" | "POST";
  status: "PROGRESS";
}
export interface JobStatus {
  id: string;
  name: "STORY" | "POST";
  status: "PROGRESS" | "SUCCESS" | "FAILED";
}

export interface PaginatedReqDto {
  page? : number;
  limit?: number;
  name?: string
}
export interface NotificationDto {
    id: string;
    content: string;
    purpose: "STORY" | "CHAT" | "REEL" | "POST" | "COMMENT";
    isRead: boolean;
}
export type NotifyType = {
    type: "STORY";
    stryId: string;
    profileId: string;
} | {
    type: "CHAT" | "MESSAGE";
    chatId: string;
} | {
    type: "REEL";
    reelId: string;
    profileId: string;
} | {
    type: "POST";
    postId: string;
    profileId: string;
}