import { Role } from "./user.details";

export interface RegisterResult {
  id: string;
  email: string;
  username: string;
  role: Role;
}

export interface LoginResult {
    accessToken: string;
}
export interface RefreshResult {
    accessToken: string;
}