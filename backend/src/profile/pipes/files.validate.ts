import { BadRequestException, PipeTransform } from '@nestjs/common';

export class AvatarValidationPipe implements PipeTransform {
  transform(avatar: Express.Multer.File) {
    const size = 500 * 1000; // 500 kb allowed
    if (avatar.size > size) {
      throw new BadRequestException('File too large');
    }
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(avatar.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    return avatar;
  }
}
