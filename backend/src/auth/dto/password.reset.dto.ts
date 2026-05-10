import { Injectable } from '@nestjs/common';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@Injectable()
export class TokenDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
    message: 'Invalid token format',
  })
  token: string;
}

@Injectable()
export class OtpVerifyDto extends TokenDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 characters long' })
  @Matches(/^[0-9]*$/, { message: 'OTP must contain only numbers' })
  otp: string;
}

@Injectable()
export class NewPassDto extends TokenDto {
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be string' })
  @MinLength(6, { message: 'Minimum 6 charecters are required' })
  @MaxLength(200, { message: 'Maximum 50 charecters are allowed' })
  password: string;
}
