import { FileValidator, Injectable } from '@nestjs/common';

@Injectable()
export class MyCustomImageValidator extends FileValidator {
  isValid(file: Express.Multer.File): boolean {
    const maxSize = 500 * 1024; // 500KB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    // Returns true only if BOTH conditions are met
    return file.size <= maxSize && allowedTypes.includes(file.mimetype);
  }

  buildErrorMessage(file: Express.Multer.File): string {
    return 'File must be a PNG/JPG and smaller than 500KB';
  }
}
