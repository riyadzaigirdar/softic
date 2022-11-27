import { LoginDto } from '../dtos/login.dto';
import { SignupDto } from '../dtos/signup.dto';
import { UserService } from '../services/user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ResponseDto } from 'src/common/constants/common.dto';
import { AllowAnonymous } from 'src/common/decorators/permission.decorator';
import { AuthorizeGuard } from 'src/common/guards/authorize.guard';
import { ModuleName } from 'src/common/constants/classes';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';

@UseGuards(AuthorizeGuard)
@AllowAnonymous(ModuleName.USER)
@Controller('public/user')
export class PublicUserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @HttpCode(200)
  async loginUser(@Body() body: LoginDto): Promise<ResponseDto> {
    let data = await this.userService.loginUser(body);

    return {
      code: 200,
      success: true,
      message: 'Successfully logged in',
      data,
    };
  }

  @Post('signup')
  @HttpCode(201)
  async signupUser(@Body() body: SignupDto): Promise<ResponseDto> {
    let data = await this.userService.signUpUser(body);

    return {
      code: 200,
      success: true,
      message: 'Successfully created user',
      data,
    };
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<ResponseDto> {
    let data = await this.userService.forgotPassword(body);

    return {
      code: 200,
      success: true,
      message: 'Successfully sent verification email',
      data,
    };
  }

  @Get('/verify-email/:hash')
  async verifyEmail(@Param('hash') hash: string): Promise<ResponseDto> {
    let data = await this.userService.verifyEmail(hash);

    return {
      code: 200,
      success: true,
      message: 'Successfully verified email',
      data,
    };
  }
}
