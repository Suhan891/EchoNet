import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './file-upload/cloudinary.service';

@Global()
@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CommonModule {}
