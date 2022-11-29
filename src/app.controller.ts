import configuration from './config';
import { Controller, Get } from '@nestjs/common';
import { ResponseDto } from './common/constants/common.dto';

@Controller('hello')
export class AppController {
  @Get()
  getHello(): ResponseDto {
    return {
      code: 200,
      success: true,
      message: 'hello from app running from port ' + configuration.PORT,
      data: { ok: 1 },
    };
  }
}
