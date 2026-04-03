import { BadGatewayException, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SavedPostDto } from '../dto/posts.dto';

export class SavedPostExistsPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(savedPostId: string): Promise<SavedPostDto> {
    const savedPost = await this.prisma.savePost.findFirst({
      where: { id: savedPostId },
      select: { id: true, profileId: true },
    });
    if (!savedPost)
      throw new BadGatewayException('No such Saved post Post exists');
    return savedPost;
  }
}
