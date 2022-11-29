import { google } from 'googleapis';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import configuration from '../../../config';
import { Repository, EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { OAuthCallbackQueryDto } from '../dtos/oauth-callback-query.dto';
import { HttpService } from '@nestjs/axios';
import { User } from '../entities/user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import { IOAuthUserInfo } from 'src/common/constants/interfaces';
import { SignUpRoleEnum, UserRoleEnum } from 'src/common/constants/enums';

@Injectable()
export class OAuthService extends AuthService {
  protected oauth2Client: OAuth2Client;

  protected authorizationUrl: string;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly httpService: HttpService,
  ) {
    super();

    this.configService = new ConfigService(configuration);

    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('OAUTH').OAUTH_CLIENT_ID,
      this.configService.get('OAUTH').OAUTH_CLIENT_SECRET,
      this.configService.get('OAUTH').OAUTH_REDIRECT_URL,
    );

    this.authorizationUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline', // for generating access and refresh token
      scope: [
        'https://www.googleapis.com/auth/cloud-platform',
        'openid',
        'email',
        'profile',
      ],
      include_granted_scopes: true,
    });
  }

  getAuthorizationUrl() {
    return {
      url: this.authorizationUrl,
    };
  }

  async oAuthLogin(query: OAuthCallbackQueryDto) {
    if (query.error) {
      throw new BadRequestException(query.error);
    }

    if (!query.code) {
      throw new BadRequestException('Must define code in query');
    }

    try {
      const { tokens } = await this.oauth2Client.getToken(query.code);

      const oAuthUser: IOAuthUserInfo = await this.getGoogleUserInfo(
        tokens.access_token,
      );

      const userFound = await this.userRepository.findOne({
        where: { email: oAuthUser.email },
      });

      // If already have an account then generate token for user
      // OAuth login for general_user and admin
      if (userFound) {
        return await this.generateTokenForUser(userFound);
      }

      // Only create account for general user
      let newUser: User;

      await this.manager.transaction(
        async (transactionEntityManager: EntityManager) => {
          const userRepository: Repository<User> =
            transactionEntityManager.getRepository(User);

          newUser = await transactionEntityManager.save(
            userRepository.create({
              fullName: oAuthUser.name,
              email: oAuthUser.email,
              profilePicture: oAuthUser.picture,
              emailVerified: oAuthUser.verified_email,
              password: null,
              role:
                query.role === SignUpRoleEnum.GENERAL_USER &&
                UserRoleEnum.GENERAL_USER,
            }),
          );
        },
      );

      return await this.generateTokenForUser(newUser);
    } catch (error) {
      Logger.error(`error: ${error}`, 'get long time token function');
      throw new BadRequestException(error);
    }
  }

  private async getGoogleUserInfo(access_token: string) {
    let url = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`;

    try {
      let res = await lastValueFrom(this.httpService.get(url));

      if (res.status !== 200) {
        throw new BadRequestException(res.statusText);
      }
      return res.data;
    } catch (error) {
      throw new BadRequestException(error.response.data.message);
    }
  }
}
