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

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  async listPost(reqUser: ITokenPayload, query: ListPostQueryDto) {
    let baseQuery = this.postRepository.createQueryBuilder('post');

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

  async createPost(reqUser: ITokenPayload, body: CreatePostDto) {
    if (body.userId && reqUser.role !== UserRoleEnum.SUPER_ADMIN) {
      throw new ForbiddenException('User must be super_admin');
    }

    return await this.postRepository.save(
      await this.postRepository.create({ ...body, userId: reqUser.id }),
    );
  }

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

    if (
      reqUser.role === UserRoleEnum.GENERAL_USER &&
      foundPost.userId !== reqUser.id
    ) {
      throw new ForbiddenException('Forbidden resource');
    }

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
