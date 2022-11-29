import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import { SignUpRoleEnum } from 'src/common/constants/enums';

export class OAuthCallbackQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'error' })
  error?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'code' })
  code?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'scope' })
  scope?: string;

  @IsDefined()
  @IsEnum(SignUpRoleEnum, {
    message: `query role must be ${Object.values(SignUpRoleEnum).join(',')}`,
  })
  @ApiPropertyOptional({
    type: [String],
    description: 'role',
    enum: SignUpRoleEnum,
  })
  role: SignUpRoleEnum;
}
