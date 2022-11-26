import { IsDefined, IsString } from 'class-validator';

export class GenerateTokenResponseDto {
  @IsDefined()
  @IsString()
  accessToken: string;

  @IsDefined()
  @IsString()
  refreshToken: string;
}
