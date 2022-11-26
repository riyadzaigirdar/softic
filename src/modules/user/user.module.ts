import { Module, Global } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
