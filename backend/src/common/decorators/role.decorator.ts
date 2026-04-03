import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/auth/tokens/token.dto';

export const ROLE_KEY = 'ROLE';

export const ResponseMessage = (allowedRole: Role) => {
  const role = allowedRole ?? 'USER';
  return SetMetadata(ROLE_KEY, role);
};
