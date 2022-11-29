import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from '../entities/post.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ListPostQueryDto } from '../dtos/list-post-query.dto';
import { CreatePostDto } from '../dtos/create-post-body.dto';
import { UpdatePostDto } from '../dtos/update-post-body.dto';
import { ITokenPayload } from 'src/common/constants/interfaces';
import { UserRoleEnum } from 'src/common/constants/enums';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // ====== RE-USABLE FUNCTION FOR BOTH ADMIN AND GENERAL USER ====== //
  async listPost(reqUser: ITokenPayload, query: ListPostQueryDto) {
    let baseQuery = this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user');

    if (reqUser.role === UserRoleEnum.GENERAL_USER) {
      baseQuery.andWhere('post.userId = :userId', { userId: reqUser.id });
    }

    if (query.isPublished) {
      baseQuery.andWhere('post.isPublished = :isPublished', {
        isPublished: query.isPublished,
      });
    }

    if (query.search) {
      baseQuery.andWhere(
        '(post.title ilike :search or post.body ilike :search)',
        {
          search: `%${query.search.trim()}%`,
        },
      );
    }

    const total = await baseQuery.getCount();

    if (total === 0) {
      return {
        total,
        result: [],
      };
    }

    const result = await baseQuery
      .select([
        'post.id as "postId"',
        'post.title as "postTitle"',
        'post.body as "postBody"',
        'post.isPublished as "isPublished"',
        'user.userId as "userId"',
        'user.fullName as "fullName"',
        'user.email as "email"',
      ])
      .orderBy('post.createdAt', 'DESC')
      .offset((query.page - 1) * query.count)
      .limit(query.count)
      .getRawMany();

    return {
      result,
      total,
    };
  }

  // ====== RE-USABLE FUNCTION FOR BOTH ADMIN AND GENERAL USER ====== //
  async createPost(reqUser: ITokenPayload, body: CreatePostDto) {
    // ===== REQUESTED USER MUST BE ADMIN IF POSTING FOR OTHERS ===== //
    if (body.userId && reqUser.role !== UserRoleEnum.SUPER_ADMIN) {
      throw new ForbiddenException('User must be super_admin');
    }

    // ======= IF ADMIN, SELECTED USER MUST BE A GENERAL USER ======= //

    if (
      body.userId &&
      (await (
        await this.userRepository.findOne({ where: { userId: body.userId } })
      ).role) !== UserRoleEnum.GENERAL_USER
    ) {
      throw new ForbiddenException('Selected user is not a general user');
    }

    return await this.postRepository.save(
      await this.postRepository.create({
        ...body,
        userId: body.userId
          ? (
              await this.userRepository.findOne({
                where: { userId: body.userId },
                select: ['id'],
              })
            ).id // inserting primary key id if userId provided in body
          : reqUser.id,
      }),
    );
  }

  // ====== RE-USABLE FUNCTION FOR BOTH ADMIN AND GENERAL USER ====== //
  async updatePost(
    reqUser: ITokenPayload,
    postId: number,
    body: UpdatePostDto,
  ) {
    let foundPost = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!foundPost) {
      throw new NotFoundException('Post with that id not found');
    }

    // ===== GENERAL USERS CAN ONLY UPDATE THEIR OWN POST ===== //
    if (
      reqUser.role === UserRoleEnum.GENERAL_USER &&
      foundPost.userId !== reqUser.id
    ) {
      throw new ForbiddenException('Forbidden resource');
    }

    // ======= POST OWNERSHIP CAN ONLY BE CHANGED BY ADMIN ======= //
    if (body.userId && reqUser.role !== UserRoleEnum.SUPER_ADMIN) {
      throw new ForbiddenException('User must be super_admin');
    }

    Object.keys(body).map((key) => {
      foundPost[key] = body[key];
    });

    let savedPost = await this.postRepository.save(foundPost);

    return savedPost;
  }
}
