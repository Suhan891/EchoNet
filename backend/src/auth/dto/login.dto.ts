import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Not a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be string' })
  @MinLength(6, { message: 'Minimum 6 charecters are required' })
  @MaxLength(200, { message: 'Maximum 50 charecters are allowed' })
  password: string;
}

export class LoginResponseDTO {
  email: string;
  username: string;
  accessToken: string;
}

export class RefreshAccessDto {
  id: string;
  isEmailVerified: string;
  isActive: string;
}

export class resetDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Not a valid email' })
  email: string;
}
