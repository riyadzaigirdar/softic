import { Controller, Get, UseGuards } from '@nestjs/common';
import { ModuleName } from 'src/common/constants/classes';
import { ResponseDto } from 'src/common/constants/common.dto';
import { UserRoleEnum } from 'src/common/constants/enums';
import { ITokenPayload } from 'src/common/constants/interfaces';
import { ReqUser } from 'src/common/decorators/param.decorator';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { AuthorizeGuard } from 'src/common/guards/authorize.guard';
import { UserService } from '../services/user.service';

@UseGuards(AuthorizeGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @Permissions(ModuleName.USER, [
    UserRoleEnum.SUPER_ADMIN,
    UserRoleEnum.GENERAL_USER,
  ])
  async me(@ReqUser() reqUser: ITokenPayload): Promise<ResponseDto> {
    let data = await this.userService.getMe(reqUser);

    return {
      code: 200,
      success: true,
      message: 'Successfully get me data',
      data,
    };
  }
}
