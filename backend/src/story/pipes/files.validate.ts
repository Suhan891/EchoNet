import { BadGatewayException, Injectable, PipeTransform } from '@nestjs/common';
import { FileValidateDto } from '../dto/file.type.dto';

@Injectable()
export class StoryMediaValidation implements PipeTransform {
  transform(value: FileValidateDto) {
    if (!value) throw new BadGatewayException('No file Received');

    if (value?.image) {
      value.image.forEach((file: Express.Multer.File) => {
        if (!file) throw new BadGatewayException('No Image Received');

        const maxSize = 5 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (file.size > maxSize || !allowedTypes.includes(file.mimetype)) {
          throw new BadGatewayException('Image not of specified size');
        }
      });
    }

    if (value?.video) {
      value.video.forEach((file: Express.Multer.File) => {
        if (!file) throw new BadGatewayException('No Video Received');

        const maxSize = 20 * 1024 * 1024;
        const allowedTypes = ['video/mp4', 'video/quicktime'];

        if (file.size > maxSize || !allowedTypes.includes(file.mimetype)) {
          throw new BadGatewayException('Video not of specified size');
        }
      });
    }

    if (value?.audio) {
      value.audio.forEach((file: Express.Multer.File) => {
        if (!file) throw new BadGatewayException('No Video Received');

        const maxSize = 10 * 1024 * 1024;
        const allowedTypes = ['audio/mp4', 'audio/mp3'];

        if (file.size > maxSize || !allowedTypes.includes(file.mimetype)) {
          throw new BadGatewayException('Video not of specified size');
        }
      });
    }

    return value;
  }
}
