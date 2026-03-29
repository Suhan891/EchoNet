import { Inject, Injectable } from '@nestjs/common';
import {
  v2 as cloud,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryReelService {
  constructor(
    @Inject('CLOUDINARY')
    private cloudinary: typeof cloud,
  ) {}

  uploadVideoReel(file: Express.Multer.File, filename: string) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      // 1. Define the stream and fix the syntax (notice the closing ')' after the config object)
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: `social_media/reels`,
          public_id: filename,
          resource_type: 'video',
          transformation: [
            { duration: '15.0', crop: 'trim' },
            { quality: 'auto' },
          ],
          // This will run in background
          eager: [{ height: 1080, width: 1350, crop: 'fill', gravity: 'auto' }],
          eager_async: true,
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) return reject(new Error(error.message));
          if (!result)
            return reject(new Error('Upload failed: No result returned'));
          resolve(result);
        },
      );

      // 2. Use the correct variable name (uploadStream) to pipe the buffer
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteReel(publicId: string): Promise<any> {
    return this.cloudinary.uploader.destroy(publicId);
  }
}
