import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @IsIn(['0', '1'], { message: 'Private data mismatch' })
  private?: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be string' })
  @MinLength(3, { message: 'Minimum 3 charecters name is required' })
  @MaxLength(100, { message: 'Maximum 100 charecters name is allowed' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Bio must be string' })
  @MaxLength(120, { message: 'Maximum 120 charecters are allowed' })
  bio?: string;
}

export class UpdateProfileDto {
  @IsString({ message: 'Name must be string' })
  @MinLength(3, { message: 'Minimum 3 charecters are required' })
  @MaxLength(100, { message: 'Maximum 100 charecters are allowed' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Bio must be string' })
  @MaxLength(120, { message: 'Max 120 charecters are allowed' })
  bio?: string;
}

// After token -> Checking
export interface profileDto {
  // After Profile authentication
  id: string;
  name: string;
  bio?: string;
  isPrivate: boolean;
  user: {
    id: string;
  };
  isActive: boolean;
}

export interface othersProfile {
  id: string;
  isPrivate: boolean;
}

export interface toggleProf {
  id: string;
  userId: string;
}
