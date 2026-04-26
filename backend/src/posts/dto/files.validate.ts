import { FileValidator, Injectable } from '@nestjs/common';

@Injectable()
export class PostMediaValidatorPipe extends FileValidator {
  isValid(file: Express.Multer.File): boolean {
    if (!file) return false;

    const maxSize = 5 * 1024 * 1024; // 5mb
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (file.size > maxSize || !allowedTypes.includes(file.mimetype)) {
      return false;
    }

    return true;
  }

  buildErrorMessage(): string {
    return 'Each file must be a PNG/JPG and smaller than 5MB';
  }
}
