import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReplyCommentDto } from '../dto/request.dto';

export interface ValueDto {
  parentId: string;
  profileId: string;
  content: string;
}

@Injectable()
export class ValidateReplyPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(value: ValueDto): Promise<ReplyCommentDto> {
    const comment = await this.prisma.comments.findFirst({
      where: { id: value.parentId },
      select: {
        id: true,
        profileId: true,
        postId: true,
        reelId: true,
      },
    });

    if (!comment)
      throw new BadRequestException('No such Parent Comment exists');

    if (value.profileId === comment.profileId)
      throw new BadRequestException('You cannot reply your own comment');

    return {
      parentId: comment.id,
      profileId: value.profileId,
      postId: comment.postId ?? undefined,
      reelId: comment.reelId ?? undefined,
      content: value.content,
    };
  }
}
