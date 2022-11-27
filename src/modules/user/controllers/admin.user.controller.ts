import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ModuleName } from 'src/common/constants/classes';
import { ResponseDto } from 'src/common/constants/common.dto';
import { UserRoleEnum } from 'src/common/constants/enums';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { AuthorizeGuard } from 'src/common/guards/authorize.guard';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserListQueryDto } from '../dtos/user-list-query.dto';
import { UserService } from '../services/user.service';

@UseGuards(AuthorizeGuard)
@Permissions(ModuleName.USER, [UserRoleEnum.SUPER_ADMIN])
@Controller('admin/user')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async getUserListByAdmin(
    @Query() query: UserListQueryDto,
  ): Promise<ResponseDto> {
    let data = await this.userService.getUserListByAdmin(query);

    return {
      code: 200,
      success: true,
      message: 'Successfully get user list',
      data,
    };
  }

  @Put(':userId')
  async updateUserByAdmin(
    @Param('userId') userId: string,
    @Body() body: UpdateUserDto,
  ): Promise<ResponseDto> {
    let data = await this.userService.updateUserByAdmin(userId, body);

    return {
      code: 200,
      success: true,
      message: 'Successfully get user list',
      data,
    };
  }
}
