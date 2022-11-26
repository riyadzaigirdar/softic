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
