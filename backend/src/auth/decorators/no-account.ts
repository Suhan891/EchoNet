import { SetMetadata } from '@nestjs/common';

export const NO_ACCOUNT = 'no_account';
export const NoAccount = () => SetMetadata(NO_ACCOUNT, true);

export const ACTIVATE_ME = 'activate_gaurd';
export const ActivateMe = () => SetMetadata(ACTIVATE_ME, true);
