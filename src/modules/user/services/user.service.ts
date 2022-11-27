import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from '../dtos/login.dto';
import { SignupDto } from '../dtos/signup.dto';
import { SignUpRoleEnum, UserRoleEnum } from 'src/common/constants/enums';
import { ITokenPayload } from 'src/common/constants/interfaces';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserListQueryDto } from '../dtos/user-list-query.dto';

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

    let passwordMatched = await this.checkPasswordMatch(
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
      hash: newUser.emailVerifyHash,
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

  async updateUser(reqUser: ITokenPayload, body: UpdateUserDto) {
    let foundUser = await this.userRepository.findOne({
      where: { userId: reqUser.userId },
    });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    if (body.fullName) {
      foundUser.fullName = body.fullName;
    }

    if (body.password) {
      foundUser.password = await this.hashPassword(body.password);
    }

    let savedUser = await this.userRepository.save(foundUser);

    return {
      userId: savedUser.userId,
      fullName: savedUser.fullName,
      email: savedUser.email,
    };
  }

  async uploadImage(reqUser: ITokenPayload, buffer) {
    let userFound = await this.userRepository.findOne({
      where: { userId: reqUser.userId },
    });

    if (!userFound) {
      throw new NotFoundException('Email with that user not found');
    }

    let link = `media/${buffer.originalname}`;

    await fs.createWriteStream(link).write(Buffer.from(buffer.toString()));

    userFound.profilePicture = link;

    let userSaved = await this.userRepository.save(userFound);

    return {
      userId: userSaved.userId,
      profilePicture: userSaved.profilePicture,
    };
  }

  async forgotPassword(body: ForgotPasswordDto) {
    let userFound = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (!userFound) {
      throw new NotFoundException('Email with that user not found');
    }

    userFound.emailVerifyHash = uuid();

    userFound.emailVerified = false;

    // =========== SENT VERIFICATION HASH TO EMAIL ============== //

    let userSaved = await this.userRepository.save(userFound);

    return {
      emailVerified: userSaved.emailVerified,
      emailVerifyHash: userSaved.emailVerifyHash,
    };
  }

  async verifyEmail(hash: string) {
    let userFound = await this.userRepository.findOne({
      where: { emailVerifyHash: hash },
    });

    if (!userFound) {
      throw new NotFoundException('User with that hash not found');
    }

    userFound.emailVerifyHash = null;

    userFound.emailVerified = true;

    let userSaved = await this.userRepository.save(userFound);

    return {
      emailVerified: userSaved.emailVerified,
      emailVerifyHash: userSaved.emailVerifyHash,
    };
  }

  async getUserListByAdmin(query: UserListQueryDto) {
    let baseQuery = this.userRepository.createQueryBuilder('user');

    if (query.role) {
      baseQuery.andWhere('user.role = :role', {
        role: query.role,
      });
    }

    if (query.search) {
      baseQuery.andWhere(
        '(user.fullName ilike :search or user.email ilike :search)',
        {
          search: `%${query.search.trim()}%`,
        },
      );
    }

    const total: number = await baseQuery.getCount();

    if (total === 0) {
      return {
        total,
        result: [],
      };
    }

    const result = await baseQuery
      .select([
        'user.id as "id"',
        'user.userId as "userId"',
        'user.createdAt as "createdAt"',
        'user.fullName as "fullName"',
        'user.email as "email"',
        'user.emailVerified as "emailVerified"',
        'user.role as "role"',
        'user.profilePicture as "profilePicture"',
        'user.isBanned as "isBanned"',
        'user.lastLogin as "lastLogin"',
        'user.lastActivity as "lastActivity"',
      ])
      .orderBy('user.createdAt', 'DESC')
      .offset((query.page - 1) * query.count)
      .limit(query.count)
      .getRawMany();

    return { result, total };
  }

  async updateUserByAdmin(userId: string, body: UpdateUserDto) {
    let foundUser = await this.userRepository.findOne({ where: { userId } });

    if (!foundUser) {
      throw new NotFoundException('User with that userId not found');
    }

    if (foundUser.role !== UserRoleEnum.GENERAL_USER) {
      throw new ForbiddenException('User is not a general user');
    }

    if (body.fullName) {
      foundUser.fullName = body.fullName;
    }

    if (body.password) {
      foundUser.password = await this.hashPassword(body.password);
    }

    let savedUser = await this.userRepository.save(foundUser);

    return {
      userId: savedUser.userId,
      fullName: savedUser.fullName,
    };
  }
}
