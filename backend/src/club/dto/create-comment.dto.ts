// src/dto/create-comment.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  userName: string;  // Added userName

  @IsString()
  @IsNotEmpty()
  userAvatar: string; // Added userAvatar
}