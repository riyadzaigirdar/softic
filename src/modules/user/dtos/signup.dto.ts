import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsDefined,
  IsString,
  IsEmail,
  MinLength,
} from 'class-validator';
import { SignUpRoleEnum } from 'src/common/constants/enums';

// ====== ONLY WORKS WITH common import ======== //
const normalizer = require('normalize-email');

export class SignupDto {
  @IsDefined()
  @IsEmail()
  @Transform((data) => {
    if (data.value) {
      return normalizer(data.value);
    }
    return data.value;
  })
  email: string;

  @IsDefined()
  @IsString()
  @MinLength(3)
  fullName: string;

  @IsDefined()
  @IsString()
  @MinLength(6)
  password: string;

  @IsDefined()
  @IsEnum(SignUpRoleEnum, {
    message: `role must be ${Object.values(SignUpRoleEnum).join(',')}`,
  })
  role: SignUpRoleEnum;
}
