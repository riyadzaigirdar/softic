import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ListPostQueryDto {
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @IsNumber()
  count: number = 10;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    return value === 'true';
  })
  isPublished: boolean;

  @IsOptional()
  @IsString()
  search: string = '';
}
