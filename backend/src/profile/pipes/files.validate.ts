import { BadRequestException, PipeTransform } from '@nestjs/common';

export class AvatarValidationPipe implements PipeTransform {
  transform(avatar: Express.Multer.File) {
    if (!avatar) throw new BadRequestException('Avatar is required');
    const size = 5 * 1024 * 1024; // 500 mb allowed
    if (avatar.size > size) {
      throw new BadRequestException('File too large');
    }
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(avatar.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    return avatar;
  }
}
