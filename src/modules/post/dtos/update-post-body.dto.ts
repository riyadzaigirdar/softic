import { CreatePostDto } from './create-post-body.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePostDto extends CreatePostDto {
  @IsOptional()
  @IsBoolean()
  isPublished: boolean;
}
