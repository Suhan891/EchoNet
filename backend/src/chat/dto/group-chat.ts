import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class GroupChatDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be string' })
  @MaxLength(100, { message: 'Maximum 100 charecters are allowed' })
  name: string;

  @IsArray()
  @IsUUID('4', { each: true })
  profiles: string[];
}
