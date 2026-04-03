import { Module } from '@nestjs/common';
import { ReelsService } from './reels.service';
import { ReelsController } from './reels.controller';
import { CloudinaryService } from 'src/common/file-upload/cloudinary.service';

@Module({
  imports: [CloudinaryService],
  providers: [ReelsService],
  controllers: [ReelsController],
})
export class ReelsModule {}
