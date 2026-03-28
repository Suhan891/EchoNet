import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloud } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: typeof cloud,
  ) {}
}
