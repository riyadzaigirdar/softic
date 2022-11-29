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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized response' })
@UseGuards(AuthorizeGuard)
@Permissions(ModuleName.USER, [UserRoleEnum.SUPER_ADMIN])
@Controller('admin/post')
export class AdminPostController {
  constructor(private readonly postService: PostService) {}

  @ApiOkResponse({ description: 'post list by admin' })
  @Get('')
  async getPostListByAdmin(
    @ReqUser() reqUser: ITokenPayload,
    @Query() query: ListPostQueryDto,
  ): Promise<ResponseDto> {
    let data = await this.postService.listPost(reqUser, query);

    return {
      code: 200,
      success: true,
      message: 'Successfully get list of post from admin panel',
      data,
    };
  }

  @ApiOkResponse({ description: 'create post by admin' })
  @Post('')
  async createPostByAdmin(
    @ReqUser() reqUser: ITokenPayload,
    @Body() body: CreatePostDto,
  ): Promise<ResponseDto> {
    let data = await this.postService.createPost(reqUser, body);

    return {
      code: 201,
      success: true,
      message: 'Successfully created post from admin panel',
      data,
    };
  }

  @ApiOkResponse({ description: 'update post by admin' })
  @Put(':postId')
  async updatePostByAdmin(
    @ReqUser() reqUser: ITokenPayload,
    @Param('postId') postId: number,
    @Body() body: UpdatePostDto,
  ): Promise<ResponseDto> {
    let data = await this.postService.updatePost(reqUser, postId, body);

    return {
      code: 200,
      success: true,
      message: 'Successfully update post from admin panel',
      data,
    };
  }
}
