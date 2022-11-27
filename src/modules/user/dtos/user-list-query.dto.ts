import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/common/constants/enums';

export class UserListQueryDto {
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @IsNumber()
  count: number = 10;

  @IsOptional()
  @IsString()
  search: string = '';

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum = null;
}
