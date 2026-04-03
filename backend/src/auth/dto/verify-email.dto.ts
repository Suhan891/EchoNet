import { Role } from '../tokens/token.dto';

export interface verifyDto {
  id: string;
  role: Role;
  isEmailVerified: boolean;
  username: string;
}
