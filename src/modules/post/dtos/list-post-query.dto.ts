import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ListPostQueryDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'page',
    type: Number,
    default: 1,
    minimum: 1,
  })
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'count',
    type: Number,
    default: 10,
    minimum: 1,
  })
  count: number = 10;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    return value === 'true';
  })
  @ApiPropertyOptional({
    description: 'isPublished',
    type: Boolean,
    default: null,
  })
  isPublished: boolean = null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'search',
    type: String,
    default: '',
  })
  search: string = '';
}
