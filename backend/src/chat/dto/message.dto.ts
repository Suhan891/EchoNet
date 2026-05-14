import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Format } from 'src/generated/prisma/enums';
export class MessageDto {
  @IsOptional()
  @IsString({ message: 'Content must be string' })
  content?: string;

  @IsOptional() // Data arising from image kit
  @IsString({ message: 'Media must be a string' })
  mediaUrl?: string;

  @IsNotEmpty()
  @IsIn(['TEXT', 'FILE', 'VIDEO', 'GIF', 'IMAGE'], {
    message: 'Message format mismatch',
  })
  format: Format;
}

export interface MsgViewDto {
  id: string;
  sender: {
    profileId: string;
  };
  msgView: {
    viewedAt: Date;
    member: {
      profile: {
        id: string;
        name: string;
        avatarUrl: string | null;
      };
    };
  }[];
}
