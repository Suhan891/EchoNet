import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Caption is required' })
  @IsString({ message: 'Caption must be string' })
  @MinLength(5, { message: 'Minimum 5 charecters are required' })
  caption: string;

  @IsOptional()
  @IsString({ message: 'Desription must be string' })
  @MaxLength(150, { message: 'Not more than 200 words' })
  description?: string;

  // @IsNotEmpty({message: 'Order is required'})
}

export interface PostEvent {
  postId: string;
  name: string;
  profileId: string;
  medias: Array<Express.Multer.File>;
}
