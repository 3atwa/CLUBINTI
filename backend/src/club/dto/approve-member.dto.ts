// src/club/dto/approve-member.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class ApproveMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}