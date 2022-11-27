import configuration from './config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommentModule } from './modules/comment/comment.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/all-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        ...config.get('DATABASE'),
        retryDelay: 3000,
      }),
    }),
    UserModule,
    PostModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
