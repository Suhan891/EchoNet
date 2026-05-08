import { Media } from 'src/generated/prisma/enums';
export interface StoryDto {
  id: string;
  profileId: string;
}
// export interface StoryMediaDataDto {
//   id: string;
//   mediaType: Media;
//   mediaUrl: string;
//   story: {
//     profileId: string;
//     id: string;
//   };
// }
export interface StoryViewEvent {
  storyMediaId: string;
  viewerId: string;
}
