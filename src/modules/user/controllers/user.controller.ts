import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ModuleName } from 'src/common/constants/classes';
import { ResponseDto } from 'src/common/constants/common.dto';
import { UserRoleEnum } from 'src/common/constants/enums';
import { ITokenPayload } from 'src/common/constants/interfaces';
import { ReqUser } from 'src/common/decorators/param.decorator';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { AuthorizeGuard } from 'src/common/guards/authorize.guard';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserService } from '../services/user.service';

@ApiBearerAuth('authorization')
@ApiUnauthorizedResponse({ description: 'Unauthorized response' })
@UseGuards(AuthorizeGuard)
@Permissions(ModuleName.USER, [
  UserRoleEnum.SUPER_ADMIN,
  UserRoleEnum.GENERAL_USER,
])
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ description: 'get me', status: 200 })
  @Get('/me')
  async me(@ReqUser() reqUser: ITokenPayload): Promise<ResponseDto> {
    let data = await this.userService.getMe(reqUser);

    return {
      code: 200,
      success: true,
      message: 'Successfully get me data',
      data,
    };
  }

  @ApiOkResponse({ description: 'update user', status: 200 })
  @Put('/')
  async updateUser(
    @ReqUser() reqUser: ITokenPayload,
    @Body()
    body: UpdateUserDto,
  ): Promise<ResponseDto> {
    let data = await this.userService.updateUser(reqUser, body);

    return {
      code: 200,
      success: true,
      message: 'Successfully get me data',
      data,
    };
  }

  @ApiOkResponse({ description: 'upload image', status: 200 })
  @Post('/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @ReqUser() reqUser: ITokenPayload,
    @UploadedFile() file,
  ): Promise<ResponseDto> {
    let data = await this.userService.uploadImage(reqUser, file);

    return {
      code: 200,
      success: true,
      message: 'Successfully get me data',
      data,
    };
  }
}
