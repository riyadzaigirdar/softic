import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ModuleName } from 'src/common/constants/classes';
import { ResponseDto } from 'src/common/constants/common.dto';
import { AllowAnonymous } from 'src/common/decorators/permission.decorator';
import { AuthorizeGuard } from 'src/common/guards/authorize.guard';
import { OAuthCallbackQueryDto } from '../dtos/oauth-callback-query.dto';
import { OAuthService } from '../services/oauth.service';

@UseGuards(AuthorizeGuard)
@AllowAnonymous(ModuleName.USER)
@Controller('public/oauth')
export class PublicOAuthController {
  constructor(private readonly oAuthService: OAuthService) {}

  @Get('login-url')
  oAuthLoginUrl(): ResponseDto {
    let data = this.oAuthService.getAuthorizationUrl();
    return {
      code: 200,
      success: true,
      message: 'Successfully generated oauth login url',
      data,
    };
  }

  @Get('login')
  async oAuthLogin(
    @Query() query: OAuthCallbackQueryDto,
  ): Promise<ResponseDto> {
    let data = await this.oAuthService.oAuthLogin(query);

    return {
      code: 200,
      success: true,
      message: 'Successfully logged in',
      data,
    };
  }
}
