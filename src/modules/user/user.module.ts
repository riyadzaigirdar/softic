import { User } from './entities/user.entity';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { PublicUserController } from './controllers/public.user.controller';
import { AdminUserController } from './controllers/admin.user.controller';
import { OAuthService } from './services/oauth.service';
import { PublicOAuthController } from './controllers/public.oauth.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule],
  controllers: [
    AdminUserController,
    PublicUserController,
    UserController,
    PublicOAuthController,
  ],
  providers: [UserService, AuthService, OAuthService],
  exports: [AuthService],
})
export class UserModule {}
