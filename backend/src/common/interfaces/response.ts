import { Role } from 'src/generated/prisma/enums';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  timestamp: string;
}

export interface ExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export interface JwtUserDto {
  id: string;
  role: Role;
  isEmailVerified: boolean;
  isActive: boolean;
  tokenVersion: number;
  profile: {
    id: string;
  }[];
}
