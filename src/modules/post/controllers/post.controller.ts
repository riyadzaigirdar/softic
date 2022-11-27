import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ModuleName } from 'src/common/constants/classes';
import { ResponseDto } from 'src/common/constants/common.dto';
import { UserRoleEnum } from 'src/common/constants/enums';
import { ITokenPayload } from 'src/common/constants/interfaces';
import { ReqUser } from 'src/common/decorators/param.decorator';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { AuthorizeGuard } from 'src/common/guards/authorize.guard';
import { CreatePostDto } from '../dtos/create-post-body.dto';
import { ListPostQueryDto } from '../dtos/list-post-query.dto';
import { UpdatePostDto } from '../dtos/update-post-body.dto';
import { PostService } from '../services/post.service';

@UseGuards(AuthorizeGuard)
@Permissions(ModuleName.USER, [UserRoleEnum.GENERAL_USER])
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('')
  async getPostListByUser(
    @ReqUser() reqUser: ITokenPayload,
    @Query() query: ListPostQueryDto,
  ): Promise<ResponseDto> {
    let data = await this.postService.listPost(reqUser, query);

    return {
      code: 200,
      success: true,
      message: 'Successfully get list of post',
      data,
    };
  }

  @Post('')
  async createPostByUser(
    @ReqUser() reqUser: ITokenPayload,
    @Body() body: CreatePostDto,
  ): Promise<ResponseDto> {
    let data = await this.postService.createPost(reqUser, body);

    return {
      code: 201,
      success: true,
      message: 'Successfully created post',
      data,
    };
  }

  @Put(':postId')
  async updatePostByUser(
    @ReqUser() reqUser: ITokenPayload,
    @Param('postId') postId: number,
    @Body() body: UpdatePostDto,
  ): Promise<ResponseDto> {
    let data = await this.postService.updatePost(reqUser, postId, body);

    return {
      code: 201,
      success: true,
      message: 'Successfully updated post',
      data,
    };
  }
}
