import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class GenerateTokenResponseDto {
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String, description: 'accessToken' })
  accessToken: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ type: String, description: 'refreshToken' })
  refreshToken: string;
}
