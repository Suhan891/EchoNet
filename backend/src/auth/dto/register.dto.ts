import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be string' })
  @MinLength(3, { message: 'Minimum 3 charecters are required' })
  @MaxLength(200, { message: 'Maximum 200 charecters are allowed' })
  username: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Not a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be string' })
  @MinLength(6, { message: 'Minimum 6 charecters are required' })
  @MaxLength(200, { message: 'Maximum 50 charecters are allowed' })
  password: string;
}

export class RegisterResponseDTO {
  email: string;
  username: string;
  role?: string;
}
