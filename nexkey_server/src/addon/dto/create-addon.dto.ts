import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsNumber, IsUUID, Length, Min } from 'class-validator';
import { AddonType } from '../addon.entity';

export class CreateAddonDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;

  @IsEnum(AddonType)
  @IsOptional()
  type?: AddonType;

  @IsDateString()
  @IsNotEmpty()
  startingTime: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  duration: number; // Duration in minutes

  @IsString()
  @IsOptional()
  @Length(0, 255)
  contractAddress?: string;

  @IsUUID()
  @IsNotEmpty()
  enterpriseId: string;
} 