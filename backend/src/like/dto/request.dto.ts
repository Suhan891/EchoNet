export type RequestType = 'STORY' | 'POST' | 'REEL';
export interface RequestDto {
  id: string;
  profileId: string;
  name: RequestType;
}

export interface LikeDTo {
  id: string;
  profileId: string;
}
