import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CloudinaryService } from 'src/common/file-upload/cloudinary.service';

@Module({
  imports: [CloudinaryService],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
