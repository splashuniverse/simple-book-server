import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { AUTH_PROVIDER } from 'src/enum';

export class DeviceInfoDto {
  @IsNotEmpty()
  @IsString()
  os: string;

  @IsNotEmpty()
  @IsString()
  osVersion: string;

  @IsNotEmpty()
  @IsString()
  version: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  freeDiskStorage: number;

  @IsNotEmpty()
  @IsNumber()
  firstInstallTime: number;

  @IsNotEmpty()
  @IsString()
  buildId: string;

  @IsNotEmpty()
  @IsString()
  bundleId: string;

  @IsOptional()
  @IsString()
  carrierName?: string;

  @IsNotEmpty()
  @IsBoolean()
  emulator: boolean;

  @IsNotEmpty()
  @IsString()
  abis: string;
}

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  pictureUrl?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(AUTH_PROVIDER)
  provider: AUTH_PROVIDER;

  @IsOptional()
  @IsString()
  socialUId?: string;

  @ValidateIf((o) => o.provider === AUTH_PROVIDER.EMAIL)
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsNotEmpty()
  @IsBoolean()
  agreeTerms: boolean;

  @IsNotEmpty()
  @IsBoolean()
  agreePrivacy: boolean;

  @IsNotEmpty()
  @IsBoolean()
  agreeLocation: boolean;

  @IsNotEmpty()
  @IsBoolean()
  agreeMarketing: boolean;
}

export class LoginDto {
  @IsEnum(AUTH_PROVIDER)
  @IsNotEmpty()
  provider: AUTH_PROVIDER;

  @ValidateIf((o) => o.provider !== AUTH_PROVIDER.EMAIL)
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo: DeviceInfoDto;
}

export class AutoLoginDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo: DeviceInfoDto;
}

export class LogoutDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo: DeviceInfoDto;
}
