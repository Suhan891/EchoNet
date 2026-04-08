export interface OwnProfileResponse {
  id: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  followers?: {
    id: string;
  };
  followings?: {
    id: string;
  };
  story?: {
    id: string;
  };
  sentNotifications?: {
    id: string;
  };
}

export interface ProfileState {}