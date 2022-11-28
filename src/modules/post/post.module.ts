import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { AdminPostController } from './controllers/admin.post.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), UserModule],
  providers: [PostService],
  controllers: [AdminPostController, PostController],
})
export class PostModule {}
