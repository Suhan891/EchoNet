import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  v2 as cloud,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  private cloudinary = cloud;
  onModuleInit() {
    this.cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  uploadedAvatar(avatar: Express.Multer.File, fileName: string) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'social_media/avatar',
          public_id: fileName,
          resource_type: 'image',
          eager: [
            {
              width: 150,
              height: 150,
              crop: 'thumb',
              gravity: 'face',
              radius: 'max',
              fetch_format: 'auto',
            },
          ],
        },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) return reject(new Error(error.message));
          if (result) return resolve(result);
          reject(new Error('No result returned from Cloudinary'));
        },
      );
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
      streamifier.createReadStream(avatar.buffer).pipe(uploadStream);
    });
  }

  uploadPost(file: Express.Multer.File, filename: string, profileName: string) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: `social_media/posts/${profileName}`,
          public_id: filename,
          resource_type: 'image',
          transformation: [
            { height: 1080, width: 1350, crop: 'fill', gravity: 'auto' },
          ], // Combined into one object
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

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

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
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadImageStory(file: Express.Multer.File, filename: string) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: `social_media/story`,
          public_id: filename,
          resource_type: 'image',
          transformation: [
            { height: 1080, width: 1350, crop: 'fill', gravity: 'auto' },
          ], // Combined into one object
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

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadVideoStory(file: Express.Multer.File, filename: string) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: `social_media/story`,
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

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadAudioAndMerge(
    audioFile: Express.Multer.File,
    imgPublicId: string,
    fileName: string,
  ) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: `social_media/story`,
          public_id: fileName,
          resource_type: 'video',
          transformation: [
            { width: 1080, height: 1350, crop: 'fill' },
            { underlay: imgPublicId.replace(/\//g, ':') },
            { flags: 'layer_apply' },
            { duration: '15.0', crop: 'trim' }, // Trim to 15s
            { quality: 'auto', fetch_format: 'mp4' },
          ],
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

      streamifier.createReadStream(audioFile.buffer).pipe(uploadStream);
    });
  }

  async delete(publicId: string): Promise<any> {
    return this.cloudinary.uploader.destroy(publicId);
  }
}
