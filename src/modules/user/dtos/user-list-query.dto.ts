import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/common/constants/enums';

export class UserListQueryDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    type: Number,
    description: 'page',
    default: 1,
    minimum: 1,
  })
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    type: Number,
    description: 'count',
    default: 10,
    minimum: 1,
  })
  count: number = 10;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'search',
    default: '',
  })
  search: string = '';

  @IsOptional()
  @IsEnum(UserRoleEnum)
  @ApiPropertyOptional({
    type: [String],
    description: 'role',
    enum: UserRoleEnum,
    default: null,
  })
  role: UserRoleEnum = null;
}
