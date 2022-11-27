import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from '../dtos/login.dto';
import { SignupDto } from '../dtos/signup.dto';
import { SignUpRoleEnum, UserRoleEnum } from 'src/common/constants/enums';
import { ITokenPayload } from 'src/common/constants/interfaces';

@Injectable()
export class UserService extends AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {
    super();
  }

  async loginUser(body: LoginDto) {
    let foundUser: User = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (!foundUser) {
      throw new NotFoundException('User with that email not found');
    }

    if (foundUser.isBanned) {
      throw new ForbiddenException('Your account has been temporarily banned');
    }

    if (
      body.allowedUserRoles &&
      !body.allowedUserRoles.includes(foundUser.role)
    ) {
      throw new ForbiddenException(
        'You are trying to access with a wrong account',
      );
    }

    let passwordMatched = this.checkPasswordMatch(
      body.password,
      foundUser.password,
    );

    if (!passwordMatched) {
      throw new ForbiddenException("Password didn't match");
    }

    foundUser.lastLogin = new Date();

    await this.userRepository.save(foundUser);

    return await this.generateTokenForUser(foundUser);
  }

  async signUpUser(body: SignupDto) {
    let userFound = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (userFound) {
      throw new ForbiddenException('User with that email already exists');
    }

    let newUser: User;

    await this.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        const userRepository: Repository<User> =
          transactionEntityManager.getRepository(User);

        newUser = await transactionEntityManager.save(
          userRepository.create({
            fullName: body.fullName,
            email: body.email,
            password: await this.hashPassword(body.password),
            role:
              body.role === SignUpRoleEnum.GENERAL_USER &&
              UserRoleEnum.GENERAL_USER,
          }),
        );
      },
    );

    return {
      userId: newUser.userId,
      fullName: newUser.fullName,
      email: newUser.email,
    };
  }

  async getMe(reqUser: ITokenPayload) {
    let found = await this.userRepository.findOne({
      where: { userId: reqUser.userId },
      select: [
        'id',
        'userId',
        'fullName',
        'email',
        'profilePicture',
        'role',
        'emailVerified',
        'isBanned',
        'lastActivity',
        'lastLogin',
      ],
    });

    if (!found) {
      throw new NotFoundException('User not found');
    }

    return found;
  }
}
