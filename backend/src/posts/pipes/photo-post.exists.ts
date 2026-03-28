import { BadGatewayException, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class PostsPhotoExistsPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(postsPhotoId: string) {
    const postsPhoto = await this.prisma.postPhoto.findFirst({
      where: { id: postsPhotoId },
      select: { id: true },
    });
    if (!postsPhoto)
      throw new BadGatewayException('No such Posts Photo exists');
    return postsPhoto.id;
  }
}
