import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { UserRoleEnum } from 'src/common/constants/enums';

// ====== ONLY WORKS WITH REQUIRED MODULE WAY ======== //
const normalizer = require('normalize-email');

export class LoginDto {
  @IsDefined()
  @IsEmail()
  @Transform((data) => {
    if (data.value) {
      return normalizer(data.value);
    }
    return data.value;
  })
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @IsDefined()
  @IsString()
  @MinLength(6)
  @ApiProperty({ type: String, description: 'password', minLength: 6 })
  password: string;

  @IsOptional()
  @IsEnum(UserRoleEnum, { each: true, message: 'Invalid allowedUserRoles' })
  @ApiPropertyOptional({
    type: [String],
    description: 'Allowed user roles',
    enum: UserRoleEnum,
  })
  allowedUserRoles: string[];
}
