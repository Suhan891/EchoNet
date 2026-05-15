export interface StoryNotify {
  type: 'STORY';
  storyId: string;
  profileId?: string;
}
export interface ChatNotify {
  type: 'CHAT' | 'MESSAGE';
  chatId: string;
}
export interface ReelNotify {
  type: 'REEL';
  reelId: string;
  profileId?: string;
}
export interface PostNotify {
  type: 'POST';
  postId: string;
  profileId?: string;
}
export type Format = StoryNotify | ChatNotify | ReelNotify | PostNotify;
export interface NotifyType {
  format: Format;
  isRead: boolean;
  id: string;
}
export interface NotifyDto {
  receiverId: string;
  content: string;
  format: Format;
}
