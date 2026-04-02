import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommmentDto {
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be string' })
  @MinLength(5, { message: 'Minimum 5 charecters are required' })
  content: string;
}
