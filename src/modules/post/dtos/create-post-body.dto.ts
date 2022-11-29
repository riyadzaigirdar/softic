import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsDefined()
  @IsString()
  @ApiPropertyOptional({ description: 'title', type: String })
  title: string;

  @IsDefined()
  @IsString()
  @ApiPropertyOptional({ description: 'body', type: String })
  body: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'userId', type: String })
  userId: string;
}
