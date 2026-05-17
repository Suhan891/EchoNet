export interface otherProfileDto {
  id: string;
  userId: string;
  posts: {
    id: string;
  }[];
  story: {
    id: string;
  } | null;
}
