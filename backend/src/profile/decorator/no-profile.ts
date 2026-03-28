import { SetMetadata } from '@nestjs/common';

export const NO_PROFILE = 'no_profile';
export const NoProfile = () => SetMetadata(NO_PROFILE, true);

export const NOT_ACTIVE = 'not_active';
export const NotActive = () => SetMetadata(NOT_ACTIVE, true);
