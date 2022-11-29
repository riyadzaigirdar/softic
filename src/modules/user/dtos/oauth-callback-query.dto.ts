import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import { SignUpRoleEnum } from 'src/common/constants/enums';

export class OAuthCallbackQueryDto {
  @IsOptional()
  @IsString()
  error?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsDefined()
  @IsEnum(SignUpRoleEnum, {
    message: `query role must be ${Object.values(SignUpRoleEnum).join(',')}`,
  })
  role: SignUpRoleEnum;
}
