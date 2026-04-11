import { Role } from "./user.details";

export interface RegisterResult {
  id: string;
  email: string;
  username: string;
  role: Role;
}
export interface VerifyResult {
  isEmailVerified: boolean;
  email: string;
  username: string;
  isActive: string;
}

export interface LoginResult {
  accessToken: string;
}
export interface RefreshResult {
  accessToken: string;
}
