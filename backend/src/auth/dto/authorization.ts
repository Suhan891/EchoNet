enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export interface JwtPayload {
  sub: string;
  role: Role;
  iat?: number;
  exp?: number;
}
export interface AuthDTO {
  userId: string;
  role: Role;
  profile?: string; // be later require more thinking
}
