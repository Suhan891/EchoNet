import { FileValidator, Injectable } from '@nestjs/common';

@Injectable()
export class PostMediaValidatorPipe extends FileValidator {
  isValid(file: Express.Multer.File): boolean {
    if (!file) return false;

    const maxSize = 500 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    // If EITHER fails, return false
    if (file.size > maxSize || !allowedTypes.includes(file.mimetype)) {
      return false;
    }

    return true;
  }

  buildErrorMessage(): string {
    return 'Each file must be a PNG/JPG and smaller than 500KB';
  }
}
