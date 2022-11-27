import { User } from './entities/user.entity';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { PublicUserController } from './controllers/public.user.controller';
import { AdminUserController } from './controllers/admin.user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdminUserController, PublicUserController, UserController],
  providers: [UserService, AuthService],
  exports: [AuthService],
})
export class UserModule {}
