// src/club/dto/update-club.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateClubDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  category?: string;
}