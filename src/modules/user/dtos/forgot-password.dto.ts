import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsEmail } from 'class-validator';

// ====== ONLY WORKS WITH COMMON IMPORT ======== //
const normalizer = require('normalize-email');

export class ForgotPasswordDto {
  @IsDefined()
  @IsEmail()
  @Transform((data) => {
    if (data.value) {
      return normalizer(data.value);
    }
    return data.value;
  })
  @ApiProperty({ type: String, description: 'email' })
  email: string;
}
