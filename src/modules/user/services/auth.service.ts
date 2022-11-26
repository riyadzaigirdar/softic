import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import configuration from '../../../config';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { ITokenPayload } from 'src/common/constants/interfaces';
import { GenerateTokenResponseDto } from '../dtos/generate-token-response.dto';

@Injectable()
export class AuthService {
  protected configService: ConfigService;

  constructor() {
    this.configService = new ConfigService(configuration);
  }

  protected async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  protected async checkPasswordMatch(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  protected async generateTokenForUser(
    user: User,
  ): Promise<GenerateTokenResponseDto> {
    let payload: ITokenPayload = {
      id: user.id,
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
      role: user.role,
      isBanned: user.isBanned,
      emailVerified: user.emailVerified,
    };

    let accessToken: string = await jwt.sign(
      payload,
      this.configService.get('JWT_SECRET'),
      {
        expiresIn: 60 * 20, // 20 minutes
        algorithm: 'HS256',
      },
    );

    let refreshToken: string = await jwt.sign(
      payload,
      this.configService.get('JWT_SECRET'),
      {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        algorithm: 'HS256',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateToken(request: any): Promise<ITokenPayload> {
    if (!request.headers.authorization) {
      throw new BadRequestException('No authorization provided');
    }

    const token: string = request.headers['authorization'].replace(
      'Bearer ',
      '',
    );

    try {
      var decoded: ITokenPayload = jwt.verify(
        token,
        this.configService.get('JWT_SECRET'),
      ) as ITokenPayload;

      request['user'] = decoded;

      return decoded;
    } catch (error: any) {
      // Unauthorized for invalid credentials
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
