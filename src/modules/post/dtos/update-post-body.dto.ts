import { CreatePostDto } from './create-post-body.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto extends CreatePostDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'isPublished',
    type: Boolean,
    default: undefined,
  })
  isPublished: boolean;
}
