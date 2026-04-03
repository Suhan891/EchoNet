import { SetMetadata } from '@nestjs/common';

export const NO_ACCOUNT = 'no_account';
export const NoAccount = (actiavte: boolean) =>
  SetMetadata(NO_ACCOUNT, actiavte ?? true);

export const ACTIVATE_ME = 'activate_gaurd';
export const ActivateMe = (activate: boolean) =>
  SetMetadata(ACTIVATE_ME, activate ?? true);
