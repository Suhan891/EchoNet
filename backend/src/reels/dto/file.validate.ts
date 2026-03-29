import { FileValidator, Injectable } from '@nestjs/common';

@Injectable()
export class ReelMediaValidatorPipe extends FileValidator {
  isValid(file: Express.Multer.File): boolean {
    if (!file) return false;

    const maxSize = 20 * 1024 * 1024;
    const allowedTypes = ['video/mp4', 'video/quicktime'];

    // If EITHER fails, return false
    if (file.size > maxSize || !allowedTypes.includes(file.mimetype)) {
      return false;
    }

    return true;
  }

  buildErrorMessage(): string {
    return 'Video must be a MP4/quicktime and smaller than 20mb';
  }
}
