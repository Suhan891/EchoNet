export type RequestType = 'STORY' | 'POST' | 'REEL';
export interface RequestDto {
  id: string;
  profileId: string;
  name: RequestType;
}
export interface ResLikeDto {
  id: string;
  profileId: string;
  name: RequestType;
  likeId?: string;
}
