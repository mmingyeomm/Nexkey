import { IsString, IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator';

export class CreateEnterpriseDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  walletAddress?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
} 