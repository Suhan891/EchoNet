export type StoryMediaType = 'image'|'video' | 'combined';
export interface FileValidateDto {
  image?: Array<Express.Multer.File>;
  video?: Array<Express.Multer.File>;
  audio?: Array<Express.Multer.File>;
}
