import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @ApiPropertyOptional({ type: String, description: 'fullName', minLength: 3 })
  fullName: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiPropertyOptional({ type: String, description: 'password', minLength: 6 })
  password: string;
}
