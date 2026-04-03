export interface RequestDto {
  id: string;
  profileId: string;
  name: string;
}
export interface existingCommentDto {
  id: string;
  parentComment?: {
    id: string;
  } | null;
}

export interface CommentDataDto {
  id: string;
  profileId: string;
  name: string;
  content: string;
}
export interface CommentDTo {
  id: string;
  profileId: string;
}

export interface ReplyCommentDto {
  parentId: string;
  profileId: string;
  postId?: string;
  reelId?: string;
  content: string;
}
