import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be string' })
  @MinLength(3, { message: 'Minimum 3 charecters are required' })
  @MaxLength(100, { message: 'Maximum 100 charecters are allowed' })
  name: string;

  @IsNotEmpty({ message: 'Bio is required' })
  @IsString({ message: 'Bio must be string' })
  @MinLength(3, { message: 'Minimum 10 charecters are required' })
  bio: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Name must be string' })
  @MinLength(3, { message: 'Minimum 3 charecters are required' })
  @MaxLength(100, { message: 'Maximum 100 charecters are allowed' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Bio must be string' })
  @MinLength(3, { message: 'Minimum 10 charecters are required' })
  bio: string;
}

// After token -> Checking
export interface profileDto {
  // After Profile authentication
  id: string;
  name: string;
  bio?: string;
  isActive: boolean;
}
