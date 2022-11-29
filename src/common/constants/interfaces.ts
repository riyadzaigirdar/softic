import { UserRoleEnum } from './enums';

export interface ITokenPayload {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  profilePicture: string;
  role: UserRoleEnum;
  isBanned: boolean;
  emailVerified: boolean;
}

export interface IOAuthUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
