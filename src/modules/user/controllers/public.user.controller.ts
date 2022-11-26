import { LoginDto } from '../dtos/login.dto';
import { SignupDto } from '../dtos/signup.dto';
import { UserService } from '../services/user.service';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ResponseDto } from 'src/common/constants/common.dto';
import { AllowAnonymous } from 'src/common/decorators/permission.decorator';
import { AuthorizeGuard } from 'src/common/guards/authorize.guard';
import { ModuleName } from 'src/common/constants/classes';

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
  async forgotPassword() {}
}
