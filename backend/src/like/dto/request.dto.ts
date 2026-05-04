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
  type: 'ADD' | 'DELETE';
  likeId?: string;
}

export interface LikeDTo {
  id: string;
  profileId: string;
}
