export interface FileValidateDto {
  image?: Array<Express.Multer.File>;
  video?: Array<Express.Multer.File>;
  audio?: Array<Express.Multer.File>;
}
export const StoryMediaType = {
  IMAGE: 'image',
  VIDEO: 'video',
  COMBINED: 'combined',
};
// export interface CreateStoryMediaDto {
//   type: 'image' | 'video' | 'combined';
//   image?: Express.Multer.File,
//   audio?: Express.Multer.File,
//   file?: Express.Multer.File,
// }
export interface CombinedMedia {
  type: 'combined';
  image: Express.Multer.File | undefined;
  audio: Express.Multer.File | undefined;
  file?: undefined; // Explicitly undefined to match your requirement
}

// 2. Define the version that handles general files
interface MediaFile {
  type: 'image' | 'video';
  file: Express.Multer.File | undefined;
  image?: undefined;
  audio?: undefined;
}

// 3. Combine them into a Union Type
export type StoryMediaDto = CombinedMedia | MediaFile;
