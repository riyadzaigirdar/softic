import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsString()
  body: string;

  @IsOptional()
  @IsNumber()
  userId: string;
}
