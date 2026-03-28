import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'CAption is required' })
  @IsString({ message: 'Caption must be string' })
  @MinLength(5, { message: 'Minimum 5 charecters are required' })
  caption: string;
}
