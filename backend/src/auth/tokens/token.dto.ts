export interface emailverifyDto {
  sub: string;
}
export interface refreshDto {
  sub: string;
  tokenVersion: number;
}
export type Role = 'USER' | 'ADMIN';
export interface accessDto {
  sub: string;
  role: string;
}
export interface passResetDto {
  email: string;
  name?: string;
  isValidUser: boolean;
  tokenVersion: number;
}

export interface UserProfile {
  id: string;
}
export interface authUserDto {
  // After authentication
  userId: string;
  role: Role;
  profile?: UserProfile[];
}
