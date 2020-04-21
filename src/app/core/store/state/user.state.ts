import { AuthorizedUserModel } from 'src/app/auth/authorized-user.model';

export interface IUserState {
  userData: AuthorizedUserModel;
  balance: number;
  authError: string;
}

export const initialUserState: IUserState = {
  userData: null,
  balance: 0,
  authError: '',
};
