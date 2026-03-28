import { Inject, Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloud,
} from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: typeof cloud,
  ) {}

  uploadedAvatar(avatar: Express.Multer.File, fileName: string) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'social_media/avatar',
          public_id: fileName,
          resource_type: 'image',
          transformation: [
            { gravity: 'face', height: 150, width: 150, crop: 'thumb' },
            { radius: 'max' },
            { fetch_format: 'auto' },
          ],
        },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) return reject(new Error(error.message));
          if (result) return resolve(result);
          reject(new Error('No result returned from Cloudinary'));
        },
      );

      // Converts file buffer to readable stream and pipe to upload stream
      streamifier.createReadStream(avatar.buffer).pipe(uploadStream);
    });
  }

  updateAvatar(avatar: Express.Multer.File, fileName: string) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'social_media/avatar',
          public_id: fileName, // same as before
          resource_type: 'image',
          overwrite: true,
          invalidate: true,
          transformation: [
            { gravity: 'face', height: 150, width: 150, crop: 'thumb' },
            { radius: 'max' },
            { fetch_format: 'auto' },
          ],
        },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) return reject(new Error(error.message));
          if (result) return resolve(result);
          reject(new Error('No result returned from Cloudinary'));
        },
      );

      // Converts file buffer to readable stream and pipe to upload stream
      streamifier.createReadStream(avatar.buffer).pipe(uploadStream);
    });
  }
}
