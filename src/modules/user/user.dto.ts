import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UserProfileUpdateDto {
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  agreeMarketing?: boolean;
}
